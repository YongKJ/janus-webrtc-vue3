import {CommonService} from "@/common/service/CommonService";
import {ComponentInternalInstance} from "vue";
import {Class} from "@/common/pojo/enum/Class";
import {StreamInfo} from "@/common/pojo/dto/StreamInfo";
import {JanusPlugin} from "@/common/pojo/dto/JanusPlugin";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";
import {JanusUtil} from "@/common/util/JanusUtil";
import {StreamFile} from "@/common/pojo/dto/StreamFile";
import {Point} from "@/common/pojo/dto/Point";
import {GenUtil} from "@/common/util/GenUtil";

export class JanusStreamTestService extends CommonService<JanusStreamTestService> {

    private _url: string;
    private _userId: string;
    private video: StreamFile;
    private readonly _roomId: number;
    private _files: Array<StreamFile>;
    private _streams: Array<StreamInfo>;
    private readonly mapPlugin: Map<string, JanusPlugin>;

    public constructor(vue: ComponentInternalInstance | null) {
        super(vue);
        this._url = "";
        this._userId = "";
        this._roomId = 503;
        this.video = new StreamFile();
        this._files = new Array<StreamFile>();
        this._streams = new Array<StreamInfo>();
        this.mapPlugin = new Map<string, JanusPlugin>();
    }

    public initData(): void {
        this.streamingController.setJanusUtil();
    }

    public async handleNewWatcher(points: Array<Point>): Promise<void> {
        for (let point of points) {
            if (point.id !== 1) continue;
            if (this.mapPlugin.has(point.description)) continue;
            let plugin = await JanusUtil.getPlugin(point.id, "stream", "subscriber");
            let watchData = await this.streamingController.watch(plugin, point.id);
            LogUtil.loggerLine(Log.of("JanusStreamTestService", "handleNewWatcher", "watchData", watchData));

            plugin.feed = <number>point.id;
            this.mapPlugin.set(point.id + "", plugin);
            await this.initPeer(plugin, "subscriber");
            await plugin.peer?.answer(watchData.jsep);

            let answerDesc = await plugin.peer?.answer();
            let responseData = await this.streamingController.sendAnswer(plugin, answerDesc);
            LogUtil.loggerLine(Log.of("JanusStreamTestService", "handleNewWatcher", "sendAnswer", responseData));
            await plugin.peer?.offer(answerDesc);
        }
    }

    public async handleJanus(): Promise<void> {
        let plugin = this.mapPlugin.get(this._userId);
        if (typeof plugin === "undefined") return ;
        let responseData = await this.streamingController.list(plugin);
        LogUtil.loggerLine(Log.of("JanusStreamTestService", "handleJanus", "list", responseData));
        await this.handleNewWatcher(responseData);
    }

    public async initPeer(plugin: JanusPlugin, type: "publisher" | "subscriber"): Promise<void> {
        await plugin?.peer?.candidate(undefined, iceEvent => {
            this.streamingController.sendCandidate(plugin, iceEvent.candidate);
            // LogUtil.loggerLine(Log.of("JanusWebrtcTestService", "initPeer", "iceEvent.candidate", iceEvent.candidate));
        });

        if (type === "subscriber") {
            await plugin.peer?.stream(undefined, async stream => {
                LogUtil.loggerLine(Log.of("JanusStreamTestService", "initPeer", "stream", stream));
                LogUtil.loggerLine(Log.of("JanusStreamTestService", "initPeer", "streams", this._streams));
                let streamInfo = this._streams.find(info => info.rtcDirec === (plugin.id + ""));
                if (typeof streamInfo !== "undefined") return;
                this._streams.push(StreamInfo.of(plugin.id + "", stream));
                await GenUtil.initBitrate(plugin.id + "", this._streams, plugin.peer?.getTransceiver());
                GenUtil.timer(() => (<HTMLVideoElement>document.getElementById(plugin.id + "")).srcObject = stream, 25);
            });
        }

        if (type === "publisher") {
            await plugin.peer?.stream(this._streams[0].stream);
            // await plugin.peer?.stream(this._streams[0].stream, undefined, undefined, true);
        }
    }

    public changeFiles(file: StreamFile, fileList: Array<StreamFile>): void {
        this.video = file;
        let url = URL.createObjectURL(file.raw);
        let element = <HTMLVideoElement>document.getElementById("local");
        element.src = url;

        LogUtil.loggerLine(Log.of("JanusStreamTestService", "changeFiles", "file", file));
        LogUtil.loggerLine(Log.of("JanusStreamTestService", "changeFiles", "fileList", fileList));
    }

    public uploadFiles(): void {

    }

    public disconnect(): void {

    }

    public async connect(): Promise<void> {
        if (this.isInputError()) return;
        if (this._streams.length > 0) return;
        let plugin = await JanusUtil.getPlugin(this._userId, "stream", "publisher");
        this.mapPlugin.set(this._userId, plugin);
        this.handleJanus().then();
    }

    private isInputError(): boolean {
        let userId = this._userId.trim();
        if (userId.length === 0) {
            this.warning("请输入用户标识！");
            return true;
        }
        return false;
    }

    get files(): Array<StreamFile> {
        return this._files;
    }

    set files(value: Array<StreamFile>) {
        this._files = value;
    }

    get url(): string {
        return this._url;
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
        return Class.JanusStreamTestService;
    }

    static get class(): string {
        return Class.JanusStreamTestService;
    }

}