import {PointMedia} from "@/common/pojo/dto/PointMedia";
import {Participant} from "@/common/pojo/dto/Participant";
import {DataUtil} from "@/common/util/DataUtil";

export class Point {

    private _description: string;
    private _enabled: boolean;
    private _id: number | string;
    private _media: Array<PointMedia>;
    private _metadata: string;
    private _type: string;

    public constructor(description?: string, enabled?: boolean, id?: number | string, media?: Array<PointMedia>, metadata?: string, type?: string) {
        this._description = description || "";
        this._enabled = enabled || false;
        this._id = id || "";
        this._media = media || new Array<PointMedia>();
        this._metadata = metadata || "";
        this._type = type || "";
    }

    public static of(description: string, enabled: boolean, id: number | string, media: Array<PointMedia>, metadata: string, type: string): Point {
        return new Point(description, enabled, id, media, metadata, type);
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get enabled(): boolean {
        return this._enabled;
    }

    set enabled(value: boolean) {
        this._enabled = value;
    }

    get id(): number | string {
        return this._id;
    }

    set id(value: number | string) {
        this._id = value;
    }

    get media(): Array<PointMedia> {
        return this._media;
    }

    set media(value: Array<PointMedia>) {
        if (value.length === 0 || value.length > 0 && value[0] instanceof Participant) {
            this._media = value;
        } else {
            this._media = <Array<PointMedia>>DataUtil.convertData(value, PointMedia);
        }
    }

    get metadata(): string {
        return this._metadata;
    }

    set metadata(value: string) {
        this._metadata = value;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }
}