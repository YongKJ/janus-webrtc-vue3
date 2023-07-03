import {BaseService} from "@/common/service/BaseService";
import {GenUtil} from "@/common/util/GenUtil";
import EventEmitter2 from "eventemitter2";
import {ComponentInternalInstance, ComponentPublicInstance} from "vue";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";
import { message } from 'ant-design-vue';
import {PeerController} from "@/common/controller/PeerController";
import {StreamingController} from "@/common/controller/StreamingController";
import {VideoRoomController} from "@/common/controller/VideoRoomController";
import {AudioBridgeController} from "@/common/controller/AudioBridgeController";

export abstract class CommonService<U> extends EventEmitter2 implements BaseService<U> {

    public static service: CommonService<any>;
    private readonly _vue: ComponentPublicInstance;
    private static readonly _emitter = new EventEmitter2();
    private static readonly mapData = new Map<string, any>();
    private static readonly _peerController = new PeerController();
    private static readonly _videoRoomController = new VideoRoomController();
    private static readonly _streamingController = new StreamingController();
    private static readonly _audioBridgeController = new AudioBridgeController();
    private static readonly mapVue = new Map<string, ComponentPublicInstance>();

    protected constructor(vue: ComponentInternalInstance | null) {
        super();
        if (CommonService.mapVue.size === 0) CommonService.service = this;
        this._vue = <ComponentPublicInstance>(<ComponentInternalInstance>vue).proxy;
        CommonService.mapVue.set(this.getServiceName() + (this.getProp("index") || 0), this.vue);
    }

    private getVue(name: string, index?: number): ComponentPublicInstance {
        index = index || (name === this.getServiceName() ? (this.getProp("index") || 0) : 0);
        return <ComponentPublicInstance>CommonService.mapVue.get(name + index);
    }

    private getServiceName(className?: string): string {
        if (typeof className === "undefined") {
            className = this.getClassName();
        }
        return className[0].toLowerCase() + className.substring(1);
    }

    protected abstract getClassName(): string;

    public hasService<T extends CommonService<any>>(clazz: new (vue: ComponentInternalInstance | null) => T, index?: number): boolean {
        let serviceName = this.getServiceName((<Record<string, any>>clazz).class);
        let vue = this.getVue(serviceName, index || 0);
        return typeof vue !== "undefined";
    }

    public getService<T extends CommonService<any>>(clazz: new (vue: ComponentInternalInstance | null) => T, index?: number): T {
        let serviceName = this.getServiceName((<Record<string, any>>clazz).class);
        let vue = this.getVue(serviceName, index || 0);
        return (<Record<string, any>>vue)[serviceName];
    }

    public success(msg: string) {
        message.success(msg).then();
    }

    public warning(msg: string) {
        message.warning(msg).then();
    }

    public error(msg: string) {
        message.error(msg).then();
    }

    public info(msg: string) {
        message.info(msg).then();
    }

    public toWebrtc(): void {
        this.toRouter("/webrtc");
    }

    public toStream(): void {
        this.toRouter("/stream");
    }

    public toAudio(): void {
        this.toRouter("/audio");
    }

    public toJanus(): void {
        this.toRouter("/janus");
    }

    public toTest() {
        this.toRouter("/test");
    }

    protected toRouter(path: string, query?: Record<string, any>): void {
        let uid = GenUtil.getUrlKey("uid");
        if (typeof uid !== "undefined" && uid.length > 0) {
            typeof query === "undefined" ? query = {uid: uid} : query.uid = uid;
        }
        this.vue.$router.push(typeof query === "undefined" ? {path: path} : {path: path, query: query}).then();
    }

    get audioBridgeController(): AudioBridgeController {
        return CommonService._audioBridgeController;
    }

    get videoRoomController(): VideoRoomController {
        return CommonService._videoRoomController;
    }

    get streamingController(): StreamingController {
        return CommonService._streamingController;
    }

    get peerController(): PeerController {
        return CommonService._peerController;
    }

    get service(): U {
        return (<Record<string, any>>this.vue)[this.getServiceName()];
    }

    get routerName(): string {
        return <string>this.vue.$router.currentRoute.value.name;
    }

    public getValue(name: string): any {
        return (<Record<string, any>>this.vue)[name];
    }

    public getProp(name: string): any {
        return (<Record<string, any>>this.vue.$props)[name];
    }

    public getRef(name: string): any {
        return this.vue.$refs[name];
    }

    get emitter(): EventEmitter2 {
        return CommonService._emitter;
    }

    get vue(): ComponentPublicInstance {
        return this._vue;
    }

}