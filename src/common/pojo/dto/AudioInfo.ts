
export class AudioInfo {

    private _feed: string;
    private _rtcDirec: string;

    public constructor(rtcDirec?: string, feed?: string) {
        this._feed = feed || "";
        this._rtcDirec = rtcDirec || "";
    }

    public static of(rtcDirec: string, feed: string): AudioInfo {
        return new AudioInfo(rtcDirec, feed);
    }

    get feed(): string {
        return this._feed;
    }

    set feed(value: string) {
        this._feed = value;
    }

    get rtcDirec(): string {
        return this._rtcDirec;
    }

    set rtcDirec(value: string) {
        this._rtcDirec = value;
    }
}