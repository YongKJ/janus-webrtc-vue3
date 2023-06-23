
export class WatchData {

    private _jsep: RTCSessionDescriptionInit;
    private _status: string;

    public constructor(jsep?: RTCSessionDescriptionInit, status?: string) {
        this._jsep = jsep || {type: "answer", sdp: ""};
        this._status = status || "";
    }

    public static of(jsep: RTCSessionDescriptionInit, status: string): WatchData {
        return new WatchData(jsep, status);
    }

    get jsep(): RTCSessionDescriptionInit {
        return this._jsep;
    }

    set jsep(value: RTCSessionDescriptionInit) {
        this._jsep = value;
    }

    get status(): string {
        return this._status;
    }

    set status(value: string) {
        this._status = value;
    }
}