import {StreamingService} from "@/common/service/StreamingService";
import {JanusPlugin} from "@/common/pojo/dto/JanusPlugin";
import {Point} from "@/common/pojo/dto/Point";
import {WatchData} from "@/common/pojo/dto/WatchData";

export class StreamingController {

    private streamingService: StreamingService;

    public constructor() {
        this.streamingService = new StreamingService();
    }

    public sendCandidate(plugin: JanusPlugin, candidate: RTCIceCandidate | null): Promise<Record<string, any>> {
        return this.streamingService.sendCandidate(plugin, candidate);
    }

    public sendAnswer(plugin: JanusPlugin, answerDesc?: RTCSessionDescriptionInit): Promise<Record<string, any>> {
        return this.streamingService.sendAnswer(plugin, {
            jsep: answerDesc
        });
    }

    public watch(plugin: JanusPlugin, pointId: string | number): Promise<WatchData> {
        return this.streamingService.watch(plugin, {
            id: pointId
        });
    }

    public disable(plugin: JanusPlugin, pointId: string): Promise<Record<string, any>> {
        return this.streamingService.disable(plugin, {
            id: pointId
        });
    }

    public enable(plugin: JanusPlugin, pointId: string): Promise<Record<string, any>> {
        return this.streamingService.enable(plugin, {
            id: pointId
        });
    }

    public info(plugin: JanusPlugin, pointId: string | number): Promise<Record<string, any>> {
        return this.streamingService.info(plugin, {
            id: pointId
        });
    }

    public list(plugin: JanusPlugin): Promise<Array<Point>> {
        return this.streamingService.list(plugin);
    }

    public destroyPoint(plugin: JanusPlugin, pointId: string | number): Promise<Record<string, any>> {
        return this.streamingService.destroyPoint(plugin, {
            id: pointId,
        });
    }

    public createPoint(plugin: JanusPlugin, name: string, description: string): Promise<Record<string, any>> {
        return this.streamingService.createPoint(plugin, {
            name: name,
            description: description
        });
    }

    public setJanusUtil(taskFunc?: () => void): void {
        this.streamingService.setJanusUtil(taskFunc);
    }

    public removeJanusUtil(): Promise<void> {
        return this.streamingService.removeJanusUtil();
    }

}