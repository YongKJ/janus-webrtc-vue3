import {Participant} from "@/common/pojo/dto/Participant";
import {DataUtil} from "@/common/util/DataUtil";

export class ParticipantsData {

    private _feed: string;
    private _participants: Array<Participant>;
    private _room: string | number;

    public constructor(feed?: string, participants?: Array<Participant>, room?: string | number) {
        this._feed = feed || "";
        this._room = room || "";
        this._participants = participants || new Array<Participant>();
    }

    public static of(feed: string, participants: Array<Participant>, room: string | number): ParticipantsData {
        return new ParticipantsData(feed, participants, room);
    }

    get feed(): string {
        return this._feed;
    }

    set feed(value: string) {
        this._feed = value;
    }

    get participants(): Array<Participant> {
        return this._participants;
    }

    set participants(value: Array<Participant>) {
        if (value.length === 0 || value.length > 0 && value[0] instanceof Participant) {
            this._participants = value;
        } else {
            this._participants = <Array<Participant>>DataUtil.convertData(value, Participant);
        }
    }

    get room(): string | number {
        return this._room;
    }

    set room(value: string | number) {
        this._room = value;
    }
}