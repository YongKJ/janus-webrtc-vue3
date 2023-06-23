import {CommonService} from "@/common/service/CommonService";
import {Class} from "@/common/pojo/enum/Class";
import {ComponentInternalInstance} from "vue";
import {StreamInfo} from "@/common/pojo/dto/StreamInfo";
import {WebRTCMessage} from "@/common/pojo/dto/WebRTCMessage";
import {WebRTCPeer} from "@/common/module/webrtc/WebRTCPeer";
import {GenUtil} from "@/common/util/GenUtil";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";
import {message} from "ant-design-vue";
import autobind from "autobind-decorator";

export class WebrtcPeerTestService extends CommonService<WebrtcPeerTestService> {

    private _userId: string;
    private readonly _roomId: string;
    private peer: WebRTCPeer | undefined;
    private _streams: Array<StreamInfo>;
    private readonly mapPeer = new Map<string, WebRTCPeer>();

    public constructor(vue: ComponentInternalInstance | null) {
        super(vue);
        this._userId = "";
        this._roomId = "503";
        this._streams = new Array<StreamInfo>();
        this.peer = new WebRTCPeer(this._roomId);
    }

    @autobind
    private handleMessage(msg: WebRTCMessage): void {
        switch (msg.type) {
            case "join":
                this.handleJoin(msg).then();
                break;
            case "offer":
                this.handleOffer(msg).then();
                break;
            case "answer":
                this.handleAnswer(msg).then();
                break;
            case "candidate":
                this.handleCandidate(msg).then();
                break;
            case "exit":
                this.handleExit(msg);
                break;
        }
    }

    private async handleJoin(msg: WebRTCMessage): Promise<void> {
        LogUtil.loggerLine(Log.of("WebrtcPeerTestService", "handleUserJoin", "msg", msg));
        for (let userId of msg.userList) {
            if (userId === this._userId) continue;
            let rtcDirecOne = this._userId + " -> " + userId;
            let rtcDirecTwo = userId + " -> " + this._userId;
            if (this.mapPeer.has(rtcDirecOne) || this.mapPeer.has(rtcDirecTwo)) continue;

            await this.initPeer(rtcDirecOne, userId, rtcDirecOne);
            let peer = this.mapPeer.get(rtcDirecOne);
            let offerDesc = await peer?.offer();
            LogUtil.loggerLine(Log.of("WebrtcPeerTestService", "handleUserJoin", "offerDesc", offerDesc));
            if (typeof offerDesc === "undefined") return;

            this.peerController.sendOffer(userId, rtcDirecOne, {
                sdp: offerDesc.sdp,
                type: offerDesc.type,
            });
            await peer?.offer(offerDesc);
        }
    }

    private async handleOffer(msg: WebRTCMessage): Promise<void> {
        LogUtil.loggerLine(Log.of("WebrtcPeerTestService", "handleOffer", "msg", msg));
        let peer = this.mapPeer.get(msg.rtcDirec);
        if (typeof peer === "undefined") {
            await this.initPeer(msg.rtcDirec, msg.fromUser, msg.rtcDirec);
            peer = this.mapPeer.get(msg.rtcDirec);
        }
        await peer?.answer({type: msg.param.type, sdp: msg.param.sdp});

        let answerDesc = await peer?.answer();
        this.peerController.sendAnswer(msg.fromUser, msg.rtcDirec, {
            sdp: answerDesc?.sdp,
            type: answerDesc?.type,
        });
        await peer?.offer(answerDesc);
    }

    private async handleAnswer(msg: WebRTCMessage): Promise<void> {
        LogUtil.loggerLine(Log.of("WebRTCPeerService", "handleAnswer", "msg", msg));
        let peer = this.mapPeer.get(msg.rtcDirec);
        await peer?.answer({type: msg.param.type, sdp: msg.param.sdp});
    }

    private async handleCandidate(msg: WebRTCMessage): Promise<void> {
        // LogUtil.loggerLine(Log.of("WebrtcPeerTestService", "handleCandidate", "msg", msg));
        let peer = this.mapPeer.get(msg.rtcDirec);
        await peer?.candidate({
            sdpMid: msg.param.sdpMid,
            candidate: msg.param.candidate,
            sdpMLineIndex: msg.param.sdpMLineIndex,
        });
    }

    private handleExit(msg?: WebRTCMessage): void {
        if (typeof msg === "undefined") {
            this.sendUserExit();
            return;
        }
        LogUtil.loggerLine(Log.of("WebrtcPeerTestService", "handleExit", "msg", msg));
        let rtcDirecOne = msg.fromUser + " -> " + msg.toUser;
        let rtcDirecTwo = msg.toUser + " -> " + msg.fromUser;
        this._streams = this._streams.filter(stream => {
            if (stream.rtcDirec === rtcDirecOne || stream.rtcDirec === rtcDirecTwo) {
                let rtcDirec = stream.rtcDirec === rtcDirecOne ? rtcDirecOne : rtcDirecTwo;
                stream.stream.getTracks().forEach(track => track.stop());
                this.mapPeer.get(rtcDirec)?.close();
                this.mapPeer.delete(rtcDirec);
            }
            return !(stream.rtcDirec === rtcDirecOne || stream.rtcDirec === rtcDirecTwo);
        });
        if (this._streams.length === 1 && this._streams[0].rtcDirec === "local") {
            this._streams[0].stream.getTracks().forEach(track => track.stop());
            this._streams = new Array<StreamInfo>()
        }
        GenUtil.timer(() => this._streams.forEach(stream => {
            if (stream.rtcDirec === "local") return;
            (<HTMLVideoElement>document.getElementById(stream.rtcDirec)).srcObject = stream.stream;
        }), 25);
        LogUtil.loggerLine(Log.of("WebRTCPeerService", "handleUserClose", "this._streams", this._streams));
    }

    private sendUserExit(): void {
        for (let stream of this._streams) {
            stream.stream.getTracks().forEach(track => track.stop());
            if (stream.rtcDirec === "local") continue;
            let users = stream.rtcDirec.split(" -> ");
            let toUser = users[0] === this._userId ? users[1] : users[0];
            this.peerController.exitRoom(toUser, stream.rtcDirec);
        }
        this._streams = new Array<StreamInfo>();
        this.mapPeer.forEach((peer) => peer.close());
        this.mapPeer.clear();
    }

    private async initPeer(name: string, desUserId: string, rtcDirec: string): Promise<void> {
        let peer = new WebRTCPeer(name);
        this.mapPeer.set(name, peer);

        await peer.candidate(undefined, iceEvent => {
            this.peerController.sendCandidate(desUserId, rtcDirec, {
                sdpMid: iceEvent.candidate?.sdpMid,
                candidate: iceEvent.candidate?.candidate,
                sdpMLineIndex: iceEvent.candidate?.sdpMLineIndex
            });
        });

        await peer.stream(undefined, stream => {
            LogUtil.loggerLine(Log.of("WebrtcPeerTestService", "stream", "stream", stream));
            let streamInfo = this._streams.find(info => info.rtcDirec === rtcDirec);
            if (typeof streamInfo !== "undefined") return;
            this._streams.push(StreamInfo.of(rtcDirec, stream));
            GenUtil.timer(() => (<HTMLVideoElement>document.getElementById(rtcDirec)).srcObject = stream, 25);
        });

        await peer.stream(this._streams[0].stream);
    }


    public disconnect(): void {
        this.sendUserExit();
    }

    public async connect(): Promise<void> {
        if (this.isInputError()) return;
        if (this._streams.length > 0) return;
        let mediaStream = await this.peer?.stream();
        if (typeof mediaStream === "undefined") return;
        this._streams.push(StreamInfo.of("local", mediaStream));
        this.peerController.joinRoom(this._roomId, this._userId, this.handleMessage);
        GenUtil.timer(() => (<HTMLVideoElement>document.getElementById("local")).srcObject = <MediaStream>mediaStream, 25);
    }

    private isInputError(): boolean {
        let userId = this._userId.trim();
        if (userId.length === 0) {
            message.warning("请输入用户标识！");
            return true;
        }
        return false;
    }

    get userId(): string {
        return this._userId;
    }

    set userId(value: string) {
        this._userId = value;
    }

    get roomId(): string {
        return this._roomId;
    }

    get streams(): Array<StreamInfo> {
        return this._streams;
    }

    protected getClassName(): string {
        return Class.WebrtcPeerTestService;
    }

    static get class(): string {
        return Class.WebrtcPeerTestService;
    }

}