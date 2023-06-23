import {WebRTC} from "@/common/module/webrtc/WebRTC";

export class WebRTCPeer implements WebRTC {

    private offerFlag = false;
    private answerFlag = false;
    private readonly name: string;
    private _peer: RTCPeerConnection | undefined;
    protected static readonly mapPeer = new Map<string | number, RTCPeerConnection>();

    public constructor(peerName: string | number) {
        this.name = peerName + "";
        this._peer = <RTCPeerConnection>this.getPeer();
        WebRTCPeer.mapPeer.set(peerName, this._peer);
    }

    public getPeer(name?: string | number): RTCPeerConnection | undefined {
        if (typeof name === "undefined") {
            return new RTCPeerConnection(WebRTCPeer.iceServer());
        } else {
            return WebRTCPeer.mapPeer.get(name);
        }
    }

    public getTransceiver(): RTCRtpTransceiver | undefined {
        return this._peer?.getTransceivers()[1];
    }

    public async stream(stream?: MediaStream, taskFunc?: (media: MediaStream) => void, type?: string, isPublisher?: boolean, isAudio?: boolean): Promise<MediaStream | undefined> {
        if (typeof stream !== "undefined") {
            if (!isPublisher) {
                stream.getTracks().forEach(track => this._peer?.addTrack(track, stream));
            } else {
                this._peer?.addTrack(stream.getAudioTracks()[0], stream);
                this._peer?.addTransceiver(stream.getVideoTracks()[0], {
                    streams: [stream],
                    direction: "sendonly",
                    sendEncodings: [
                        {
                            rid: "h",
                            maxBitrate: 512 * 1024
                        },
                        {
                            rid: "m",
                            maxBitrate: 256 * 1024,
                            scaleResolutionDownBy: 2
                        },
                        {
                            rid: "l",
                            maxBitrate: 128 * 1024,
                            scaleResolutionDownBy: 4
                        }
                    ]
                });
            }
        } else {
            if (typeof taskFunc === "undefined") {
                if (type === "display") {
                    return navigator?.mediaDevices?.getDisplayMedia(WebRTCPeer.mediaInfo());
                } else {
                    return navigator?.mediaDevices?.getUserMedia(WebRTCPeer.mediaInfo(isAudio));
                }
            } else {
                if (this._peer == null) return undefined;
                this._peer.ontrack = trackEvent => taskFunc(trackEvent.streams[0]);
            }
        }
    }

    public async offer(offerDesc?: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | undefined> {
        if (typeof offerDesc === "undefined") {
            return this._peer?.createOffer(WebRTCPeer.option());
        } else {
            if (!this.offerFlag) {
                this.offerFlag = true;
                await this._peer?.setLocalDescription(offerDesc);
            }
        }
    }

    public async answer(answerDesc?: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | undefined> {
        if (typeof answerDesc === "undefined") {
            return this._peer?.createAnswer(WebRTCPeer.option());
        } else {
            if (!this.answerFlag) {
                this.answerFlag = true;
                await this._peer?.setRemoteDescription(answerDesc);
            }
        }
    }

    public async candidate(candidate?: RTCIceCandidateInit, taskFunc?: (iceEvent: RTCPeerConnectionIceEvent) => void): Promise<void> {
        if (typeof candidate !== "undefined") {
            await this._peer?.addIceCandidate(candidate);
        } else {
            if (this._peer == null || typeof taskFunc === "undefined") return;
            this._peer.onicecandidate = iceEvent => taskFunc(iceEvent);
        }
    }

    public close(): void {
        this._peer?.close();
        WebRTCPeer.mapPeer.delete(this.name);
    }

    private static iceServer(): RTCConfiguration {
        return {
            iceServers: [{
                urls: "turn:coturn.yongkj.cn:5349",
                credential: "*Dxj1003746818",
                username: "yongkj",
            }]
        };
    }

    private static mediaInfo(isAudio?: boolean): MediaStreamConstraints {
        return isAudio ? {audio: true, video: false} : {audio: true, video: true};
    }

    private static option(): RTCOfferOptions {
        return {offerToReceiveAudio: true, offerToReceiveVideo: true};
    }

    set peer(value: RTCPeerConnection | undefined) {
        this._peer = value;
    }

}