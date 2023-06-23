import {CommonService} from "@/common/service/CommonService";
import {ComponentInternalInstance} from "vue";
import {Class} from "@/common/pojo/enum/Class";
import {StreamInfo} from "@/common/pojo/dto/StreamInfo";
import {JanusPlugin} from "@/common/pojo/dto/JanusPlugin";
import {message} from "ant-design-vue";
import {JanusUtil} from "@/common/util/JanusUtil";
import {Log} from "@/common/pojo/dto/Log";
import {LogUtil} from "@/common/util/LogUtil";
import {Participant} from "@/common/pojo/dto/Participant";
import {AudioInfo} from "@/common/pojo/dto/AudioInfo";
import {GenUtil} from "@/common/util/GenUtil";
import autobind from "autobind-decorator";

export class JanusAudioTestService extends CommonService<JanusAudioTestService> {

    private _userId: string;
    private _isPlay: boolean;
    private readonly _roomId: number;
    private stream: StreamInfo | undefined;
    private _participants: Array<AudioInfo>;
    private readonly mapPlugin: Map<string, JanusPlugin>;

    public constructor(vue: ComponentInternalInstance | null) {
        super(vue);
        this._userId = "";
        this._roomId = 503;
        this._isPlay = false;
        this.stream = undefined;
        this._participants = new Array<AudioInfo>();
        this.mapPlugin = new Map<string, JanusPlugin>();
    }

    public initData(): void {
        this.audioBridgeController.setJanusUtil();
    }

    public handlePeerTalking(data: Record<string, any>): void {
        LogUtil.loggerLine(Log.of("JanusAudioTestService", "handlePeerTalking", "data", data));
    }

    public handleTalking(data: Record<string, any>): void {
        LogUtil.loggerLine(Log.of("JanusAudioTestService", "handleTalking", "data", data));
    }

    public handleLeaving(leaver: Record<string, any>): void {
        LogUtil.loggerLine(Log.of("JanusAudioTestService", "handleLeaving", "leaver", leaver));
        if (!(leaver && leaver.feed)) return;
        let participants = new Array<AudioInfo>();
        for (let participant of this._participants) {
            if (participant.feed === leaver.feed) continue;
            participants.push(participant);
        }
        this._participants = participants;
    }

    @autobind
    public handleParticipant(participants: Array<Participant>): void {
        LogUtil.loggerLine(Log.of("JanusAudioTestService", "handleParticipant", "participants", participants));
        for (let participant of participants) {
            this._participants.push(AudioInfo.of(participant.display, participant.feed));
        }
    }

    public async handleJanus(): Promise<(data: any) => void> {
        let plugin = this.mapPlugin.get(this._userId);
        if (typeof plugin === "undefined") return this.handleParticipant;
        let responseData = await this.audioBridgeController.checkRoom(plugin, this._roomId);
        LogUtil.loggerLine(Log.of("JanusAudioTestService", "checkRoom", "checkRoom", responseData));
        if (!responseData.exists) {
            responseData = await this.audioBridgeController.createRoom(plugin, this._roomId, this._roomId + "视频群聊房间");
            LogUtil.loggerLine(Log.of("JanusAudioTestService", "createRoom", "createRoom", responseData));
        }

        let participantsData = await this.audioBridgeController.joinRoom(plugin, this._roomId);
        LogUtil.loggerLine(Log.of("JanusAudioTestService", "joinRoom", "join", participantsData));

        await this.initPeer(plugin);
        let offerDesc = (<RTCSessionDescriptionInit>await plugin.peer?.offer());
        // offerDesc.sdp = offerDesc.sdp?.replace("useinbandfec=1", "useinbandfec=1;stereo=1");
        let publishData = await this.audioBridgeController.sendOffer(plugin, offerDesc);
        LogUtil.loggerLine(Log.of("JanusAudioTestService", "handleJanus", "sendOffer", publishData));

        await plugin.peer?.offer(offerDesc);
        await plugin.peer?.answer(publishData.jsep);
        await this.handleParticipant(participantsData.participants);

        return this.handleParticipant;
    }

    public handleExit(): void {
        this.stream?.stream.getTracks().forEach(track => track.stop());
        for (let [name, plugin] of this.mapPlugin) {
            this.audioBridgeController.exitRoom(plugin);
        }
        this._participants = new Array<AudioInfo>();
        this.stream = undefined;
        this.mapPlugin.clear();
        this._isPlay = false;
    }

    public async initPeer(plugin: JanusPlugin): Promise<void> {
        await plugin?.peer?.candidate(undefined, iceEvent => {
            this.audioBridgeController.sendCandidate(plugin, iceEvent.candidate);
            // LogUtil.loggerLine(Log.of("JanusWebrtcTestService", "initPeer", "iceEvent.candidate", iceEvent.candidate));
        });

        await plugin.peer?.stream(undefined, async stream => {
            this._isPlay = true;
            LogUtil.loggerLine(Log.of("JanusWebrtcTestService", "initPeer", "stream", stream));
            LogUtil.loggerLine(Log.of("JanusWebrtcTestService", "initPeer", "stream.getTracks()", stream.getTracks()));
            GenUtil.timer(() => (<HTMLAudioElement>document.getElementById("muted")).srcObject = stream, 25);
        });

        await plugin.peer?.stream(this.stream?.stream);
    }

    public disconnect(): void {
        this.handleExit();
    }

    public async connect(): Promise<void> {
        if (this.isInputError()) return;
        if (typeof this.stream !== "undefined") return;
        let plugin = await JanusUtil.getPlugin(this._userId, "audio", "publisher");
        this.mapPlugin.set(this._userId, plugin);
        let mediaStream = await plugin.peer?.stream(
            undefined, undefined, undefined,
            undefined, true
        );
        if (typeof mediaStream === "undefined") return;
        this.participants.push(AudioInfo.of("local", ""));
        this.stream = StreamInfo.of("local", mediaStream);
        this.audioBridgeController.talkingSubscribe(plugin, data => this.handleTalking(data));
        this.audioBridgeController.leavingSubscribe(plugin, leaver => this.handleLeaving(leaver));
        this.audioBridgeController.peerTalkingSubscribe(plugin, data => this.handlePeerTalking(data));
        this.handleJanus().then(taskFunc => this.audioBridgeController.participantSubscribe(plugin, taskFunc));
    }

    private isInputError(): boolean {
        let userId = this._userId.trim();
        if (userId.length === 0) {
            message.warning("请输入用户标识！");
            return true;
        }
        return false;
    }

    get isPlay(): boolean {
        return this._isPlay;
    }

    set userId(value: string) {
        this._userId = value;
    }

    get userId(): string {
        return this._userId;
    }

    get roomId(): number {
        return this._roomId;
    }

    get participants(): Array<AudioInfo> {
        return this._participants;
    }

    protected getClassName(): string {
        return Class.JanusAudioTestService;
    }

    static get class(): string {
        return Class.JanusAudioTestService;
    }

}