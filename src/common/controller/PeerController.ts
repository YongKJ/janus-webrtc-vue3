import {PeerService} from "@/common/service/PeerService";
import {WebRTCMessage} from "@/common/pojo/dto/WebRTCMessage";

export class PeerController {

    private userId: string;
    private roomId: string;
    private readonly peerService: PeerService;

    public constructor() {
        this.userId = "";
        this.roomId = "";
        this.peerService = new PeerService();
    }

    public joinRoom(roomId: string, userId: string, resFunc: (msg: WebRTCMessage) => void): void {
        let msg = WebRTCMessage.get(roomId, userId);
        this.peerService.joinRoom(msg, resFunc);
        this.roomId = roomId;
        this.userId = userId;
    }

    public sendOffer(desUserId: string, rtcDirec: string, param: Record<string, any>): void {
        let msg = WebRTCMessage.of(
            this.roomId, this.userId, desUserId,
            rtcDirec, [], param, "offer"
        );
        this.peerService.sendOffer(msg);
    }

    public sendAnswer(desUserId: string, rtcDirec: string, param: Record<string, any>): void {
        let msg = WebRTCMessage.of(
            this.roomId, this.userId, desUserId,
            rtcDirec, [], param, "answer"
        );
        this.peerService.sendAnswer(msg);
    }

    public sendCandidate(desUserId: string, rtcDirec: string, param: Record<string, any>): void {
        let msg = WebRTCMessage.of(
            this.roomId, this.userId, desUserId,
            rtcDirec, [], param, "candidate"
        );
        this.peerService.sendCandidate(msg);
    }

    public exitRoom(desUserId: string, rtcDirec: string): void {
        let msg = WebRTCMessage.of(
            this.roomId, this.userId, desUserId,
            rtcDirec, [], {}, "exit"
        );
        this.peerService.exitRoom(msg);
    }

}