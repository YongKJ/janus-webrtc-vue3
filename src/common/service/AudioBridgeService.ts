import {JanusUtil} from "@/common/util/JanusUtil";
import {JanusPlugin} from "@/common/pojo/dto/JanusPlugin";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";
import {Participant} from "@/common/pojo/dto/Participant";
import {DataUtil} from "@/common/util/DataUtil";
import {ParticipantsData} from "@/common/pojo/dto/ParticipantsData";
import {Global} from "@/common/config/Global";

export class AudioBridgeService {

    private janusFlag = false;
    private janusUtil!: JanusUtil;
    private readonly CHECK_ROOM_EVENT = "exists";
    private readonly CREATE_ROOM_EVENT = "create";
    private readonly JOIN_ROOM_EVENT = "join";
    private readonly MUTE_ROOM_EVENT = "muteRoom";
    private readonly UNMUTE_ROOM_EVENT = "unmuteRoom";
    private readonly SEND_OFFER_EVENT = "configure";
    private readonly SEND_CANDIDATE_EVENT = "trickle";
    private readonly PARTICIPANT_SUBSCRIBE_EVENT = "AUDIOBRIDGE_PEER_JOINED";
    private readonly LEAVING_SUBSCRIBE_EVENT = "AUDIOBRIDGE_PEER_LEAVING";
    private readonly MUTED_SUBSCRIBE_EVENT = "AUDIOBRIDGE_ROOM_MUTED";
    private readonly TALKING_SUBSCRIBE_EVENT = "AUDIOBRIDGE_TALKING";
    private readonly PEER_TALKING_SUBSCRIBE_EVENT = "AUDIOBRIDGE_PEER_TALKING";

    public peerTalkingSubscribe(plugin: JanusPlugin, taskFunc: (data: any) => void): void {
        LogUtil.loggerLine(Log.of("AudioBridgeService", "peerTalkingSubscribe", "msg", "done"));
        this.janusUtil.sendInfo(plugin, this.PEER_TALKING_SUBSCRIBE_EVENT, undefined, data => {
            LogUtil.loggerLine(Log.of("AudioBridgeService", "AUDIOBRIDGE_PEER_TALKING", "data", data));
            taskFunc(data);
        }).then();
    }

    public talkingSubscribe(plugin: JanusPlugin, taskFunc: (data: any) => void): void {
        LogUtil.loggerLine(Log.of("AudioBridgeService", "talkingSubscribe", "msg", "done"));
        this.janusUtil.sendInfo(plugin, this.TALKING_SUBSCRIBE_EVENT, undefined, data => {
            LogUtil.loggerLine(Log.of("AudioBridgeService", "AUDIOBRIDGE_TALKING", "data", data));
            taskFunc(data);
        }).then();
    }

    public mutedSubscribe(plugin: JanusPlugin, taskFunc: (data: any) => void): void {
        this.janusUtil.sendInfo(plugin, this.MUTED_SUBSCRIBE_EVENT, undefined, data => {
            LogUtil.loggerLine(Log.of("AudioBridgeService", "AUDIOBRIDGE_ROOM_MUTED", "data", data));
            taskFunc(data);
        }).then();
    }

    public leavingSubscribe(plugin: JanusPlugin, taskFunc: (data: Record<string, any>) => void): void {
        this.janusUtil.sendInfo(plugin, this.LEAVING_SUBSCRIBE_EVENT, undefined, data => {
            LogUtil.loggerLine(Log.of("AudioBridgeService", "AUDIOBRIDGE_PEER_LEAVING", "data", data));
            taskFunc(data);
        }).then();
    }

    public participantSubscribe(plugin: JanusPlugin, taskFunc: (participants: Array<Participant>) => void): void {
        this.janusUtil.sendInfo(plugin, this.PARTICIPANT_SUBSCRIBE_EVENT, undefined, data => {
            LogUtil.loggerLine(Log.of("AudioBridgeService", "AUDIOBRIDGE_PEER_JOINED", "data", data));
            taskFunc(Array.of(<Participant>DataUtil.convertData(data, Participant)));
        }).then();
    }

    public sendCandidate(plugin: JanusPlugin, reqData: Record<string, any> | null): Promise<Record<string, any>> {
        return this.janusUtil.sendInfo(plugin, this.SEND_CANDIDATE_EVENT, reqData);
    }

    public sendOffer(plugin: JanusPlugin, reqData: Record<string, any>): Promise<Record<string, any>> {
        return this.janusUtil.sendInfo(plugin, this.SEND_OFFER_EVENT, reqData);
    }

    public unmuteRoom(plugin: JanusPlugin, reqData: Record<string, any>): Promise<Record<string, any>> {
        return this.janusUtil.sendInfo(plugin, this.UNMUTE_ROOM_EVENT, reqData);
    }

    public muteRoom(plugin: JanusPlugin, reqData: Record<string, any>): Promise<Record<string, any>> {
        return this.janusUtil.sendInfo(plugin, this.MUTE_ROOM_EVENT, reqData);
    }

    public async joinRoom(plugin: JanusPlugin, reqData: Record<string, any>): Promise<ParticipantsData> {
        let responseData = await this.janusUtil.sendInfo(plugin, this.JOIN_ROOM_EVENT, reqData);
        return <ParticipantsData>DataUtil.convertData(responseData, ParticipantsData);
    }

    public exitRoom(plugin: JanusPlugin, isLeaving?: boolean): void {
        this.janusUtil.detachPlugin(plugin, isLeaving).then();
    }

    public createRoom(plugin: JanusPlugin, reqData: Record<string, any>): Promise<Record<string, any>> {
        return this.janusUtil.sendInfo(plugin, this.CREATE_ROOM_EVENT, reqData);
    }

    public checkRoom(plugin: JanusPlugin, reqData: Record<string, any>): Promise<Record<string, any>> {
        return this.janusUtil.sendInfo(plugin, this.CHECK_ROOM_EVENT, reqData);
    }

    public setJanusUtil(taskFunc?: () => void): void {
        if (this.janusFlag) return;
        this.janusFlag = true;
        this.janusUtil = new JanusUtil(Global.JANUS_GATEWAY_BASE_URL, "audio", taskFunc);
    }

    public async removeJanusUtil(): Promise<void> {
        LogUtil.loggerLine(Log.of("AudioBridgeService", "removeJanusUtil", "this.janusFlag", this.janusFlag));
        if (!this.janusFlag) return;
        this.janusFlag = false;
        await JanusUtil.closeConnection("audio");
    }

}