
export class Participant {

    private _display: string;
    private _feed: string;
    private _muted: boolean;
    private _setup: boolean;
    private _talking: boolean;

    public constructor(display?: string, feed?: string, muted?: boolean, setup?: boolean, talking?: boolean) {
        this._display = display || "";
        this._feed = feed || "";
        this._muted = muted || false;
        this._setup = setup || false;
        this._talking = talking || false;
    }

    public static of(display: string, feed: string, muted: boolean, setup: boolean, talking: boolean): Participant {
        return new Participant(display, feed, muted, setup, talking);
    }

    get display(): string {
        return this._display;
    }

    set display(value: string) {
        this._display = value;
    }

    get feed(): string {
        return this._feed;
    }

    set feed(value: string) {
        this._feed = value;
    }

    get muted(): boolean {
        return this._muted;
    }

    set muted(value: boolean) {
        this._muted = value;
    }

    get setup(): boolean {
        return this._setup;
    }

    set setup(value: boolean) {
        this._setup = value;
    }

    get talking(): boolean {
        return this._talking;
    }

    set talking(value: boolean) {
        this._talking = value;
    }
}