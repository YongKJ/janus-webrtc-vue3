import {JanusUtil} from "@/common/util/JanusUtil";
import {Global} from "@/common/config/Global";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";
import {JanusPlugin} from "@/common/pojo/dto/JanusPlugin";
import {Point} from "@/common/pojo/dto/Point";
import {DataUtil} from "@/common/util/DataUtil";
import {WatchData} from "@/common/pojo/dto/WatchData";

export class StreamingService {

    private janusFlag = false;
    private janusUtil!: JanusUtil;
    private readonly LIST_EVENT = "list";
    private readonly INFO_EVENT = "info";
    private readonly WATCH_EVENT = "watch";
    private readonly ENABLE_EVENT = "enable";
    private readonly DISABLE_EVENT = "enable";
    private readonly SEND_ANSWER_EVENT = "start";
    private readonly SEND_CANDIDATE_EVENT = "trickle";
    private readonly DESTROY_POINT_EVENT = "destroyMountpoint";
    private readonly CREATE_POINT_EVENT = "createRtpMountpoint";

    public sendCandidate(plugin: JanusPlugin, reqData: Record<string, any> | null): Promise<Record<string, any>> {
        return this.janusUtil.sendInfo(plugin, this.SEND_CANDIDATE_EVENT, reqData);
    }

    public sendAnswer(plugin: JanusPlugin, reqData: Record<string, any>): Promise<Record<string, any>> {
        return this.janusUtil.sendInfo(plugin, this.SEND_ANSWER_EVENT, reqData);
    }

    public async watch(plugin: JanusPlugin, reqData: Record<string, any>): Promise<WatchData> {
        let responseData = await this.janusUtil.sendInfo(plugin, this.WATCH_EVENT, reqData);
        return <WatchData>DataUtil.convertData(responseData, WatchData);
    }

    public disable(plugin: JanusPlugin, reqData: Record<string, any>): Promise<Record<string, any>> {
        return this.janusUtil.sendInfo(plugin, this.DISABLE_EVENT, reqData);
    }

    public enable(plugin: JanusPlugin, reqData: Record<string, any>): Promise<Record<string, any>> {
        return this.janusUtil.sendInfo(plugin, this.ENABLE_EVENT, reqData);
    }

    public info(plugin: JanusPlugin, reqData: Record<string, any>): Promise<Record<string, any>> {
        return this.janusUtil.sendInfo(plugin, this.INFO_EVENT, reqData);
    }

    public async list(plugin: JanusPlugin): Promise<Array<Point>> {
        let responseData = await this.janusUtil.sendInfo(plugin, this.LIST_EVENT, {});
        return <Array<Point>>DataUtil.convertData(responseData.list, Point);
    }

    public destroyPoint(plugin: JanusPlugin, reqData: Record<string, any>): Promise<Record<string, any>> {
        return this.janusUtil.sendInfo(plugin, this.DESTROY_POINT_EVENT, reqData);
    }

    public createPoint(plugin: JanusPlugin, reqData: Record<string, any>): Promise<Record<string, any>> {
        return this.janusUtil.sendInfo(plugin, this.CREATE_POINT_EVENT, reqData);
    }

    public setJanusUtil(taskFunc?: () => void): void {
        if (this.janusFlag) return;
        this.janusFlag = true;
        this.janusUtil = new JanusUtil(Global.JANUS_GATEWAY_BASE_URL, "stream", taskFunc);
    }

    public async removeJanusUtil(): Promise<void> {
        LogUtil.loggerLine(Log.of("StreamingService", "removeJanusUtil", "this.janusFlag", this.janusFlag));
        if (!this.janusFlag) return;
        this.janusFlag = false;
        await JanusUtil.closeConnection("audio");
    }

}