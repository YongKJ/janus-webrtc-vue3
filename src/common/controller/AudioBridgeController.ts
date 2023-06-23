import {AudioBridgeService} from "@/common/service/AudioBridgeService";
import {JanusPlugin} from "@/common/pojo/dto/JanusPlugin";
import {Participant} from "@/common/pojo/dto/Participant";
import {ParticipantsData} from "@/common/pojo/dto/ParticipantsData";

export class AudioBridgeController {

    private readonly audioBridgeService: AudioBridgeService;

    public constructor() {
        this.audioBridgeService = new AudioBridgeService();
    }

    public peerTalkingSubscribe(plugin: JanusPlugin, taskFunc: (data: Record<string, any>) => void): void {
        this.audioBridgeService.peerTalkingSubscribe(plugin, taskFunc);
    }

    public talkingSubscribe(plugin: JanusPlugin, taskFunc: (data: Record<string, any>) => void): void {
        this.audioBridgeService.talkingSubscribe(plugin, taskFunc);
    }

    public mutedSubscribe(plugin: JanusPlugin, taskFunc: (muter: Record<string, any>) => void): void {
        this.audioBridgeService.mutedSubscribe(plugin, taskFunc);
    }

    public leavingSubscribe(plugin: JanusPlugin, taskFunc: (leaver: Record<string, any>) => void): void {
        this.audioBridgeService.leavingSubscribe(plugin, taskFunc);
    }

    public participantSubscribe(plugin: JanusPlugin, taskFunc: (participants: Array<Participant>) => void): void {
        this.audioBridgeService.participantSubscribe(plugin, taskFunc);
    }

    public sendCandidate(plugin: JanusPlugin, candidate: RTCIceCandidate | null): Promise<Record<string, any>> {
        return this.audioBridgeService.sendCandidate(plugin, candidate);
    }

    public sendOffer(plugin: JanusPlugin, offerDesc?: RTCSessionDescriptionInit): Promise<Record<string, any>> {
        return this.audioBridgeService.sendOffer(plugin, {
            muted: false,
            jsep: offerDesc
        });
    }

    public unmuteRoom(plugin: JanusPlugin, roomId: string): Promise<Record<string, any>> {
        return this.audioBridgeService.unmuteRoom(plugin, {
            room: roomId
        })
    }

    public muteRoom(plugin: JanusPlugin, roomId: string): Promise<Record<string, any>> {
        return this.audioBridgeService.muteRoom(plugin, {
            room: roomId
        })
    }

    public joinRoom(plugin: JanusPlugin, roomId: string | number): Promise<ParticipantsData> {
        return this.audioBridgeService.joinRoom(plugin, {
            room: roomId,
            display: plugin.id
        });
    }

    public exitRoom(plugin: JanusPlugin, isLeaving?: boolean): void {
        this.audioBridgeService.exitRoom(plugin, isLeaving);
    }

    public createRoom(plugin: JanusPlugin, roomId: string | number, description: string): Promise<Record<string, any>> {
        return this.audioBridgeService.createRoom(plugin, {
            room: roomId,
            description: description
        });
    }

    public checkRoom(plugin: JanusPlugin, roomId: string | number): Promise<Record<string, any>> {
        return this.audioBridgeService.checkRoom(plugin, {
            room: roomId
        });
    }

    public setJanusUtil(taskFunc?: () => void): void {
        this.audioBridgeService.setJanusUtil(taskFunc);
    }

    public removeJanusUtil(): Promise<void> {
        return this.audioBridgeService.removeJanusUtil();
    }

}