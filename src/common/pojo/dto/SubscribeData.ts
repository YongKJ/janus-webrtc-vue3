
export class SubscribeData {

    private _display: string;
    private _feed: number;
    private _jsep: RTCSessionDescriptionInit;
    private _room: string | number;

    public constructor(display?: string, feed?: number, jsep?: RTCSessionDescriptionInit, room?: string | number) {
        this._display = display || "";
        this._feed = feed || 0;
        this._jsep = jsep || {type: "answer", sdp: ""};
        this._room = room || "";
    }

    public static of(display: string, feed: number, jsep: RTCSessionDescriptionInit, room: string | number): SubscribeData {
        return new SubscribeData(display, feed, jsep, room);
    }

    get display(): string {
        return this._display;
    }

    set display(value: string) {
        this._display = value;
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