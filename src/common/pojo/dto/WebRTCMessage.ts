
export class WebRTCMessage {

    private _toUser: string;
    private _fromUser: string;
    private _rtcDirec: string;
    private _roomId: string;
    private _param: Record<string, any>;
    private _userList: Array<string>;
    private _type: "join" | "offer" | "answer" | "candidate" | "exit";

    public constructor(roomId?: string, fromUser?: string, toUser?: string, rtcDirec?: string, userList?: Array<string>, param?: Record<string, any>, type?: "join" | "offer" | "answer" | "candidate" | "exit") {
        this._roomId = roomId || "";
        this._fromUser = fromUser || "";
        this._toUser = toUser || "";
        this._rtcDirec = rtcDirec || "";
        this._param = param || {};
        this._type = type || "join";
        this._userList = userList || [];
    }

    public static of(roomId: string, fromUser: string, toUser: string, rtcDirec: string, userList: Array<string>, param: Record<string, any>, type: "join" | "offer" | "answer" | "candidate" | "exit"): WebRTCMessage {
        return new WebRTCMessage(roomId, fromUser, toUser, rtcDirec, userList, param, type);
    }

    public static get(roomId: string, userId: string): WebRTCMessage {
        return new WebRTCMessage(roomId, userId, "", "", [], {}, "join");
    }

    get roomId(): string {
        return this._roomId;
    }

    set roomId(value: string) {
        this._roomId = value;
    }

    get toUser(): string {
        return this._toUser;
    }

    set toUser(value: string) {
        this._toUser = value;
    }

    get fromUser(): string {
        return this._fromUser;
    }

    set fromUser(value: string) {
        this._fromUser = value;
    }

    get rtcDirec(): string {
        return this._rtcDirec;
    }

    set rtcDirec(value: string) {
        this._rtcDirec = value;
    }

    get userList(): Array<string> {
        return this._userList;
    }

    set userList(value: Array<string>) {
        this._userList = value;
    }

    get param(): Record<string, any> {
        return this._param;
    }

    set param(value: Record<string, any>) {
        this._param = value;
    }

    get type(): "join" | "offer" | "answer" | "candidate" | "exit" {
        return this._type;
    }

    set type(value: "join" | "offer" | "answer" | "candidate" | "exit") {
        this._type = value;
    }
}