import {VideoRoomService} from "@/common/service/VideoRoomService";
import {JanusPlugin} from "@/common/pojo/dto/JanusPlugin";
import {Publisher} from "@/common/pojo/dto/Publisher";
import {SubscribeData} from "@/common/pojo/dto/SubscribeData";
import {PublishData} from "@/common/pojo/dto/PublishData";
import {PublisherData} from "@/common/pojo/dto/PublisherData";

export class VideoRoomController {

    private readonly videoRoomService: VideoRoomService;

    public constructor() {
        this.videoRoomService = new VideoRoomService();
    }

    public configure(plugin: JanusPlugin, ): Promise<Record<string, any>> {
        return this.videoRoomService.configure(plugin, {
            audio: true,
            video: true,
            data: true,
            sc_substream_layer: 2,
            sc_substream_fallback_ms: 2,
            sc_temporal_layers: 2
        });
    }

    public leavingSubscribe(plugin: JanusPlugin, taskFunc: (leaver: Record<string, any>) => void): void {
        this.videoRoomService.leavingSubscribe(plugin, taskFunc);
    }

    public unpublishedSubscribe(plugin: JanusPlugin, taskFunc: (publisher: Record<string, any>) => void): void {
        this.videoRoomService.unpublishedSubscribe(plugin, taskFunc);
    }

    public sendCandidate(plugin: JanusPlugin, candidate: RTCIceCandidate | null): Promise<Record<string, any>> {
        return this.videoRoomService.sendCandidate(plugin, candidate);
    }

    public publishersSubscribe(plugin: JanusPlugin, taskFunc: (publishers: Array<Publisher>) => void): void {
        this.videoRoomService.publishersSubscribe(plugin, taskFunc);
    }

    public async sendAnswer(plugin: JanusPlugin, answerDesc?: RTCSessionDescriptionInit): Promise<Record<string, any>> {
        if (typeof answerDesc === "undefined") return {};
        return this.videoRoomService.sendAnswer(plugin, {
            jsep: answerDesc
        });
    }

    public joinSubscriber(plugin: JanusPlugin, roomId: string | number, feed: number): Promise<SubscribeData> {
        return this.videoRoomService.joinSubscriber(plugin, {
            room: roomId,
            feed: feed,
        });
    }

    public async sendOffer(plugin: JanusPlugin, offerDesc?: RTCSessionDescriptionInit): Promise<PublishData> {
        if (typeof offerDesc === "undefined") return new PublishData();
        return this.videoRoomService.sendOffer(plugin, {
            video: true,
            audio: true,
            jsep: offerDesc,
            data: true,
            bitrate: 256 * 1024
        });
    }

    public joinConfigurePublisher(plugin: JanusPlugin, roomId: string | number): Promise<PublisherData> {
        return this.videoRoomService.joinConfigurePublisher(plugin, {
            audio: true,
            video: true,
            room: roomId,
            display: plugin.id,
        });
    }

    public joinPublisher(plugin: JanusPlugin, roomId: string | number): Promise<PublisherData> {
        return this.videoRoomService.joinPublisher(plugin, {
            room: roomId,
            display: plugin.id,
        });
    }

    public exitRoom(plugin: JanusPlugin, isLeaving?: boolean): void {
        this.videoRoomService.exitRoom(plugin, isLeaving);
    }

    public createRoom(plugin: JanusPlugin, roomId: string | number, description: string, maxPublishers: number): Promise<Record<string, any>> {
        return this.videoRoomService.createRoom(plugin, {
            room: roomId,
            description: description,
            max_publishers: maxPublishers
        });
    }

    public checkRoom(plugin: JanusPlugin, roomId: string | number): Promise<Record<string, any>> {
        return this.videoRoomService.checkRoom(plugin, {
            room: roomId
        });
    }

    public setJanusUtil(): void {
        this.videoRoomService.setJanusUtil();
    }

}