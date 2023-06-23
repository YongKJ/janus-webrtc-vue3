
export class Publisher {

    private _audiocodec: string;
    private _display: string;
    private _feed: number;
    private _talking: boolean;
    private _videocodec: string;

    public constructor(audiocodec?: string, display?: string, feed?: number, talking?: boolean, videocodec?: string) {
        this._audiocodec = audiocodec || "";
        this._display = display || "";
        this._feed = feed || 0;
        this._talking = talking || false;
        this._videocodec = videocodec || "";
    }

    public static of(audiocodec: string, display: string, feed: number, talking: boolean, videocodec: string): Publisher {
        return new Publisher(audiocodec, display, feed, talking, videocodec);
    }

    get audiocodec(): string {
        return this._audiocodec;
    }

    set audiocodec(value: string) {
        this._audiocodec = value;
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

    get talking(): boolean {
        return this._talking;
    }

    set talking(value: boolean) {
        this._talking = value;
    }

    get videocodec(): string {
        return this._videocodec;
    }

    set videocodec(value: string) {
        this._videocodec = value;
    }
}