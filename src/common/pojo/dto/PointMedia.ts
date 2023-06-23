
export class PointMedia {

    private _age_ms: number;
    private _label: string;
    private _mid: string;
    private _type: string;

    public constructor(age_ms?: number, label?: string, mid?: string, type?: string) {
        this._age_ms = age_ms || 0;
        this._label = label || "";
        this._mid = mid || "";
        this._type = type || "";
    }

    public static of(age_ms: number, label: string, mid: string, type: string): PointMedia {
        return new PointMedia(age_ms, label, mid, type);
    }

    get age_ms(): number {
        return this._age_ms;
    }

    set age_ms(value: number) {
        this._age_ms = value;
    }

    get label(): string {
        return this._label;
    }

    set label(value: string) {
        this._label = value;
    }

    get mid(): string {
        return this._mid;
    }

    set mid(value: string) {
        this._mid = value;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }
}