
export class PublishData {

    private _configured: string;
    private _feed: number;
    private _jsep: RTCSessionDescriptionInit;
    private _room: string | number;

    public constructor(configured?: string, feed?: number, jsep?: RTCSessionDescriptionInit, room?: string | number) {
        this._configured = configured || "";
        this._feed = feed || 0;
        this._jsep = jsep || {type: "answer", sdp: ""};
        this._room = room || "";
    }

    public static of(configured: string, feed: number, jsep: RTCSessionDescriptionInit, room: string | number): PublishData {
        return new PublishData(configured, feed, jsep, room);
    }

    get configured(): string {
        return this._configured;
    }

    set configured(value: string) {
        this._configured = value;
    }

    get feed(): number {
        return this._feed;
    }

    set feed(value: number) {
        this._feed = value;
    }

    get jsep(): RTCSessionDescriptionInit {
        return this._jsep;
    }

    set jsep(value: RTCSessionDescriptionInit) {
        this._jsep = value;
    }

    get room(): string | number {
        return this._room;
    }

    set room(value: string | number) {
        this._room = value;
    }
}