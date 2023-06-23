import {CommonService} from "@/common/service/CommonService";
import {ComponentInternalInstance} from "vue";
import {Class} from "@/common/pojo/enum/Class";
import {StreamInfo} from "@/common/pojo/dto/StreamInfo";
import {Publisher} from "@/common/pojo/dto/Publisher";
import {message} from "ant-design-vue";
import {GenUtil} from "@/common/util/GenUtil";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";
import autobind from "autobind-decorator";
import {JanusPlugin} from "@/common/pojo/dto/JanusPlugin";
import {JanusUtil} from "@/common/util/JanusUtil";

export class JanusWebrtcTestService extends CommonService<JanusWebrtcTestService> {

    private _userId: string;
    private readonly _roomId: number;
    private _streams: Array<StreamInfo>;
    private readonly mapPlugin: Map<string, JanusPlugin>;

    public constructor(vue: ComponentInternalInstance | null) {
        super(vue);
        this._userId = "";
        this._roomId = 503;
        this._streams = new Array<StreamInfo>();
        this.mapPlugin = new Map<string, JanusPlugin>();
    }

    public initData(): void {
        this.videoRoomController.setJanusUtil();
    }

    @autobind
    public async handleNewPublishers(publishers: Array<Publisher>): Promise<void> {
        LogUtil.loggerLine(Log.of("JanusWebRTCTestService", "handlePublishers", "publishers", publishers));
        for (let publisher of publishers) {
            LogUtil.loggerLine(Log.of("JanusWebRTCTestService", "handlePublishers", "publisher.display", publisher.display));
            if (this.mapPlugin.has(publisher.display)) continue;
            let plugin = await JanusUtil.getPlugin(publisher.display, "video", "subscriber");
            let subscribeData = await this.videoRoomController.joinSubscriber(plugin, this.roomId, publisher.feed);
            LogUtil.loggerLine(Log.of("JanusWebRTCTestService", "handlePublishers", "subscribeData", subscribeData));
            // let configureData = await this.videoRoomController.configure(plugin);
            // LogUtil.loggerLine(Log.of("JanusWebRTCTestService", "handlePublishers", "configureData", configureData));

            plugin.feed = publisher.feed;
            this.mapPlugin.set(publisher.display, plugin);
            await this.initPeer(plugin, "subscriber");
            await plugin.peer?.answer(subscribeData.jsep);

            let answerDesc = await plugin.peer?.answer();
            let responseData = await this.videoRoomController.sendAnswer(plugin, answerDesc);
            LogUtil.loggerLine(Log.of("JanusWebRTCTestService", "handlePublishers", "responseData", responseData));
            await plugin.peer?.offer(answerDesc);
        }
    }

    public handleLeaving(leaver: Record<string, any>): void {
        if (!(leaver && leaver.feed)) return;
        let destroyIds = new Array<string>();
        for (let [name, plugin] of this.mapPlugin) {
            if (plugin.feed !== leaver.feed) continue;
            this.videoRoomController.exitRoom(plugin, true);
            destroyIds.push(plugin.id + "");
        }
        destroyIds.forEach(id => this.mapPlugin.delete(id));
        this._streams = this._streams.filter(stream => {
            if (stream.rtcDirec !== "local" && destroyIds.includes(stream.rtcDirec)) {
                stream.stream.getTracks().forEach(track => track.stop());
                clearInterval(<number>stream.bitrate?.timer);
            }
            return !(stream.rtcDirec !== "local" && destroyIds.includes(stream.rtcDirec));
        });
        GenUtil.timer(() => this._streams.forEach(stream => {
            if (stream.rtcDirec === "local") return;
            (<HTMLVideoElement>document.getElementById(stream.rtcDirec)).srcObject = stream.stream;
        }), 25);
        LogUtil.loggerLine(Log.of("JanusWebRTCTestService", "handleStream", "this._streams", this._streams));
    }

    public async handleJanus(): Promise<(publishers: Array<Publisher>) => void> {
        let plugin = this.mapPlugin.get(this._userId);
        if (typeof plugin === "undefined") return this.handleNewPublishers;
        let responseData = await this.videoRoomController.checkRoom(plugin, this._roomId);
        LogUtil.loggerLine(Log.of("JanusWebrtcTestService", "handlePublishers", "checkRoom", responseData));
        if (!responseData.exists) {
            responseData = await this.videoRoomController.createRoom(plugin, this._roomId, this._roomId + "视频群聊房间", 4);
            LogUtil.loggerLine(Log.of("JanusWebrtcTestService", "handlePublishers", "createRoom", responseData));
        }
        let publisherData = await this.videoRoomController.joinPublisher(plugin, this._roomId);
        LogUtil.loggerLine(Log.of("JanusWebrtcTestService", "handlePublishers", "joinPublisher", publisherData));

        await this.initPeer(plugin, "publisher");
        let offerDesc = await plugin.peer?.offer();
        let publishData = await this.videoRoomController.sendOffer(plugin, offerDesc);
        LogUtil.loggerLine(Log.of("JanusWebrtcTestService", "handlePublishers", "sendOffer", publishData));

        await plugin.peer?.offer(offerDesc);
        await plugin.peer?.answer(publishData.jsep);
        await this.handleNewPublishers(publisherData.publishers);

        return this.handleNewPublishers;
    }

    public handleExit(): void {
        for (let stream of this._streams) {
            // LogUtil.loggerLine(Log.of("JanusWebrtcTestService", "handleExit", "stream.rtcDirec", stream.rtcDirec));
            stream.stream.getTracks().forEach(track => track.stop());
            clearInterval(<number>stream.bitrate?.timer);
        }
        // LogUtil.loggerLine(Log.of("JanusWebrtcTestService", "handleExit", "this.mapPlugin", this.mapPlugin));
        for (let [name, plugin] of this.mapPlugin) {
            // LogUtil.loggerLine(Log.of("JanusWebrtcTestService", "handleExit", "plugin", plugin));
            this.videoRoomController.exitRoom(plugin);
        }
        this._streams = new Array<StreamInfo>();
        this.mapPlugin.clear();
    }

    public async initPeer(plugin: JanusPlugin, type: "publisher" | "subscriber"): Promise<void> {
        await plugin?.peer?.candidate(undefined, iceEvent => {
            this.videoRoomController.sendCandidate(plugin, iceEvent.candidate);
            // LogUtil.loggerLine(Log.of("JanusWebrtcTestService", "initPeer", "iceEvent.candidate", iceEvent.candidate));
        });

        if (type === "subscriber") {
            await plugin.peer?.stream(undefined, async stream => {
                let streamInfo = this._streams.find(info => info.rtcDirec === plugin.id);
                LogUtil.loggerLine(Log.of("JanusWebrtcTestService", "initPeer", "stream", stream));
                if (typeof streamInfo !== "undefined") return;
                this._streams.push(StreamInfo.of(plugin.id + "", stream));
                await this.initBitrate(plugin.id + "", plugin.peer?.getTransceiver());
                GenUtil.timer(() => (<HTMLVideoElement>document.getElementById(plugin.id + "")).srcObject = stream, 25);
            });
        }

        if (type === "publisher") {
            await plugin.peer?.stream(this._streams[0].stream);
            // await plugin.peer?.stream(this._streams[0].stream, undefined, undefined, true);
        }
    }

    public async initBitrate(rtcDirec: string, transceiver?: RTCRtpTransceiver): Promise<void> {
        if (typeof transceiver === "undefined") return;
        let stream = <StreamInfo>this.service.streams.find(stream => stream.rtcDirec === rtcDirec);
        stream.bitrate.value = "0 kbits/sec";
        LogUtil.loggerLine(Log.of("JanusWebrtcTestService", "getBitrate", "transceiver", transceiver));
        if (stream.bitrate.timer) return;
        stream.bitrate.timer = setInterval(async () => {
            let stats = await transceiver.receiver.getStats();
            stats.forEach((res: Record<string, any>) => {
                if (!JanusWebrtcTestService.isIncomingMedia(res)) return;
                stream.bitrate.bsnow = res.bytesReceived;
                stream.bitrate.tsnow = res.timestamp;
                if (stream.bitrate.bsbefore === null || stream.bitrate.tsbefore === null) {
                    stream.bitrate.bsbefore = stream.bitrate.bsnow;
                    stream.bitrate.tsbefore = stream.bitrate.tsnow;
                } else {
                    let timePassed = <number>stream.bitrate.tsnow - stream.bitrate.tsbefore;
                    let bitRate = Math.round((<number>stream.bitrate.bsnow - stream.bitrate.bsbefore) * 8 / timePassed);
                    stream.bitrate.value = bitRate + ' kbits/sec';
                    stream.bitrate.bsbefore = stream.bitrate.bsnow;
                    stream.bitrate.tsbefore = stream.bitrate.tsnow;
                }
            });
            LogUtil.loggerLine(Log.of("JanusWebrtcTestService", "getBitrate", "bitrate.value", stream.bitrate.value));
        }, 1000);
    }

    private static isIncomingMedia(res: Record<string, any>): boolean {
        if ((res.mediaType === "video" || res.id.toLowerCase().indexOf("video") > -1) &&
            res.type === "inbound-rtp" && res.id.indexOf("rtcp") < 0) {
            return true;
        } else if (res.type == 'ssrc' && res.bytesReceived &&
            (res.googCodecName === "VP8" || res.googCodecName === "")) {
            return true;
        }
        return false;
    }

    public disconnect(): void {
        this.handleExit();
    }

    public async connect(): Promise<void> {
        if (this.isInputError()) return;
        if (this._streams.length > 0) return;
        let plugin = await JanusUtil.getPlugin(this._userId, "video", "publisher");
        this.mapPlugin.set(this._userId, plugin);
        let mediaStream = await plugin.peer?.stream();
        // let mediaStream = await plugin.peer?.stream(
        //     undefined, undefined, "display"
        // );
        if (typeof mediaStream === "undefined") return;
        this._streams.push(StreamInfo.of("local", mediaStream));
        this.videoRoomController.leavingSubscribe(plugin, leaver => this.handleLeaving(leaver));
        this.handleJanus().then(taskFunc => this.videoRoomController.publishersSubscribe(plugin, taskFunc));
        GenUtil.timer(() => (<HTMLVideoElement>document.getElementById("local")).srcObject = <MediaStream>mediaStream, 25);
    }

    private isInputError(): boolean {
        let userId = this._userId.trim();
        if (userId.length === 0) {
            message.warning("请输入用户标识！");
            return true;
        }
        return false;
    }

    get roomId(): number {
        return this._roomId;
    }

    get userId(): string {
        return this._userId;
    }

    set userId(value: string) {
        this._userId = value;
    }

    get streams(): Array<StreamInfo> {
        return this._streams;
    }

    protected getClassName(): string {
        return Class.JanusWebrtcTestService;
    }

    static get class(): string {
        return Class.JanusWebrtcTestService;
    }

}