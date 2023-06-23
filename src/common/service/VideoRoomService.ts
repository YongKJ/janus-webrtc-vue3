import {JanusUtil} from "@/common/util/JanusUtil";
import {JanusPlugin} from "@/common/pojo/dto/JanusPlugin";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";
import {Publisher} from "@/common/pojo/dto/Publisher";
import {DataUtil} from "@/common/util/DataUtil";
import {SubscribeData} from "@/common/pojo/dto/SubscribeData";
import {PublishData} from "@/common/pojo/dto/PublishData";
import {PublisherData} from "@/common/pojo/dto/PublisherData";
import {Global} from "@/common/config/Global";

export class VideoRoomService {

    private janusFlag = false;
    private janusUtil!: JanusUtil;
    private readonly CHECK_ROOM_EVENT = "exists";
    private readonly CREATE_ROOM_EVENT = "create";
    private readonly JOIN_PUBLISHER_EVENT = "joinPublisher";
    private readonly SEND_OFFER_EVENT = "publish";
    private readonly JOIN_SUBSCRIBER_EVENT = "joinSubscriber";
    private readonly SEND_ANSWER_EVENT = "start";
    private readonly PUBLISHERS_SUBSCRIBE_EVENT = "VIDEOROOM_PUB_LIST";
    private readonly SEND_CANDIDATE_EVENT = "trickle";
    private readonly UNPUBLISHED_SUBSCRIBE_EVENT = "VIDEOROOM_UNPUBLISHED";
    private readonly LEAVING_SUBSCRIBE_EVENT = "VIDEOROOM_LEAVING";
    private readonly CONFIGURE_EVENT = "configure";

    public configure(plugin: JanusPlugin, reqData: Record<string, any>): Promise<Record<string, any>> {
        return this.janusUtil.sendInfo(plugin, this.CONFIGURE_EVENT, reqData);
    }

    public leavingSubscribe(plugin: JanusPlugin, taskFunc: (leaver: Record<string, any>) => void): void {
        this.janusUtil.sendInfo(plugin, this.LEAVING_SUBSCRIBE_EVENT, undefined, data => {
            LogUtil.loggerLine(Log.of("VideoRoomService", "VIDEOROOM_LEAVING", "data", data));
            taskFunc(data);
        }).then();
    }

    public unpublishedSubscribe(plugin: JanusPlugin, taskFunc: (publisher: Record<string, any>) => void): void {
        this.janusUtil.sendInfo(plugin, this.UNPUBLISHED_SUBSCRIBE_EVENT, undefined, data => {
            LogUtil.loggerLine(Log.of("VideoRoomService", "VIDEOROOM_UNPUBLISHED", "data", data));
            taskFunc(data);
        }).then();
    }

    public sendCandidate(plugin: JanusPlugin, reqData: Record<string, any> | null): Promise<Record<string, any>> {
        return this.janusUtil.sendInfo(plugin, this.SEND_CANDIDATE_EVENT, reqData);
    }

    public publishersSubscribe(plugin: JanusPlugin, taskFunc: (publishers: Array<Publisher>) => void): void {
        this.janusUtil.sendInfo(plugin, this.PUBLISHERS_SUBSCRIBE_EVENT, undefined, data => {
            LogUtil.loggerLine(Log.of("VideoRoomService", "VIDEOROOM_PUB_LIST", "data", data));
            taskFunc(<Array<Publisher>>DataUtil.convertData(data.publishers, Publisher));
        }).then();
    }

    public sendAnswer(plugin: JanusPlugin, reqData: Record<string, any>): Promise<Record<string, any>> {
        return this.sendInfo(plugin, this.SEND_ANSWER_EVENT, reqData);
    }

    public async joinSubscriber(plugin: JanusPlugin, reqData: Record<string, any>): Promise<SubscribeData> {
        let responseData = await this.janusUtil.sendInfo(plugin, this.JOIN_SUBSCRIBER_EVENT, reqData);
        return <SubscribeData>DataUtil.convertData(responseData, SubscribeData);
    }

    public async sendOffer(plugin: JanusPlugin, reqData: Record<string, any>): Promise<PublishData> {
        let responseData = await this.janusUtil.sendInfo(plugin, this.SEND_OFFER_EVENT, reqData);
        return <PublishData>DataUtil.convertData(responseData, PublishData);
    }

    public async joinConfigurePublisher(plugin: JanusPlugin, reqData: Record<string, any>): Promise<PublisherData> {
        let responseData = await this.janusUtil.sendInfo(plugin, this.JOIN_PUBLISHER_EVENT, reqData);
        return <PublisherData>DataUtil.convertData(responseData, PublisherData);
    }

    public async joinPublisher(plugin: JanusPlugin, reqData: Record<string, any>): Promise<PublisherData> {
        let responseData = await this.janusUtil.sendInfo(plugin, this.JOIN_PUBLISHER_EVENT, reqData);
        return <PublisherData>DataUtil.convertData(responseData, PublisherData);
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

    private sendInfo(plugin: JanusPlugin, event: string, reqData: Record<string, any> | null): Promise<Record<string, any>> {
        return this.janusUtil.sendInfo(plugin, event, reqData);
    }

    public setJanusUtil(): void {
        if (this.janusFlag) return;
        this.janusFlag = true;
        this.janusUtil = new JanusUtil(Global.JANUS_GATEWAY_BASE_URL, "video");
    }

}