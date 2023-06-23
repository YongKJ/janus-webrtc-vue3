import {ComponentInternalInstance, ComponentPublicInstance} from "vue";
import EventEmitter2 from "eventemitter2";
import {CommonService} from "@/common/service/CommonService";
import {VideoRoomController} from "@/common/controller/VideoRoomController";
import {StreamingController} from "@/common/controller/StreamingController";
import {AudioBridgeController} from "@/common/controller/AudioBridgeController";
import {PeerController} from "@/common/controller/PeerController";

export interface BaseService<U> {

    audioBridgeController: AudioBridgeController;

    streamingController: StreamingController;

    videoRoomController: VideoRoomController;

    peerController: PeerController;

    vue: ComponentPublicInstance;

    service: U;

    routerName: string;

    emitter: EventEmitter2;

    emit(event: string, ...values: any[]): void;

    on(event: string, func: (...values: any[]) => void): void;

    hasService<T extends CommonService<any>>(clazz: new (vue: ComponentInternalInstance | null) => T, index?: number): boolean;

    getService<T extends CommonService<any>>(clazz: new (vue: ComponentInternalInstance | null) => T, index?: number): T;

    getValue(name: string): any;

    getProp(name: string): any;

    getRef(name: string): any;

    success(msg: string): void;

    warning(msg: string): void;

    error(msg: string): void;

    info(msg: string): void;

    toWebrtc(): void;

    toStream(): void;

    toAudio(): void;

    toJanus(): void;

    toTest(): void;

}