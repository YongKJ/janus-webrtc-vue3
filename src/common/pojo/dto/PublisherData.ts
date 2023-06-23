import {Publisher} from "@/common/pojo/dto/Publisher";
import {DataUtil} from "@/common/util/DataUtil";

export class PublisherData {

    private _description: string;
    private _display: string;
    private _feed: number;
    private _private_id: number;
    private _publishers: Array<Publisher>;
    private _room: string | number;

    public constructor(description?: string, display?: string, feed?: number, private_id?: number, publishers?: Array<Publisher>, room?: string | number) {
        this._description = description || "";
        this._display = display || "";
        this._feed = feed || 0;
        this._private_id = private_id || 0;
        this._publishers = publishers || new Array<Publisher>();
        this._room = room || "";
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
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

    get private_id(): number {
        return this._private_id;
    }

    set private_id(value: number) {
        this._private_id = value;
    }

    get publishers(): Array<Publisher> {
        return this._publishers;
    }

    set publishers(value: Array<Publisher>) {
        if (value.length === 0 || value.length > 0 && value[0] instanceof Publisher) {
            this._publishers = value;
        } else {
            this._publishers = <Array<Publisher>>DataUtil.convertData(value, Publisher);
        }
    }

    get room(): string | number {
        return this._room;
    }

    set room(value: string | number) {
        this._room = value;
    }
}