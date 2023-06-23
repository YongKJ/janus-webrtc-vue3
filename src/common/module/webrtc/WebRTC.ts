
export interface WebRTC {

    getPeer(name?: string | number): RTCPeerConnection | undefined;

    stream(steam?: MediaStream, taskFunc?: (media: MediaStream) => void, type?: string): Promise<MediaStream | undefined>;

    offer(offerDesc?: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | undefined>;

    answer(answerDesc?: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | undefined>;

    candidate(candidate?: RTCIceCandidateInit, taskFunc?: (iceEvent: RTCPeerConnectionIceEvent) => void): Promise<void>;

    close(): void;

}