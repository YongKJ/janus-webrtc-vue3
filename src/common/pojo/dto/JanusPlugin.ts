import {WebRTCPeer} from "@/common/module/webrtc/WebRTCPeer";
import {JanusUtil} from "@/common/util/JanusUtil";

export class JanusPlugin {

    private _feed: number;
    private _peer: WebRTCPeer;
    private _id: string | number;
    private _events: Array<string>;
    private _plugin: Record<string, any>;
    private _role: "publisher" | "subscriber";
    private _pluginClass: Record<string, any>;
    private _type: "video" | "audio" | "stream";

    public constructor(feed?: number, id?: string | number, events?: Array<string>, peer?: WebRTCPeer, plugin?: Record<string, any>, role?: "publisher" | "subscriber", type?: "video" | "audio" | "stream", pluginClass?: Record<string, any>) {
        this._id = id || "";
        this._feed = feed || 0;
        this._plugin = plugin || {};
        this._type = type || "video";
        this._role = role || "publisher";
        this._pluginClass = pluginClass || {};
        this._events = events || new Array<string>();
        this._peer = peer || new WebRTCPeer(this._id);
    }

    public static of(feed: number, id: string | number, events: Array<string>, peer: WebRTCPeer, plugin: Record<string, any>, role: "publisher" | "subscriber", type: "video" | "audio" | "stream", pluginClass: Record<string, any>): JanusPlugin {
        return new JanusPlugin(feed, id, events, peer, plugin, role, type, pluginClass);
    }

    public static async get(id: string | number, role: "publisher" | "subscriber", type: "video" | "audio" | "stream", pluginClass: Record<string, any>): Promise<JanusPlugin> {
        return JanusPlugin.of(0, id, new Array<string>(), new WebRTCPeer(id), await JanusUtil.getJanusPlugin(pluginClass, type), role, type, pluginClass);
    }

    get type(): "video" | "audio" | "stream" {
        return this._type;
    }

    set type(value: "video" | "audio" | "stream") {
        this._type = value;
    }

    get feed(): number {
        return this._feed;
    }

    set feed(value: number) {
        this._feed = value;
    }

    get id(): string | number {
        return this._id;
    }

    set id(value: string | number) {
        this._id = value;
    }

    get events(): Array<string> {
        return this._events;
    }

    set events(value: Array<string>) {
        this._events = value;
    }

    get peer(): WebRTCPeer {
        return this._peer;
    }

    set peer(value: WebRTCPeer) {
        this._peer = value;
    }

    get plugin(): Record<string, any> {
        return this._plugin;
    }

    set plugin(value: Record<string, any>) {
        this._plugin = value;
    }

    get role(): "publisher" | "subscriber" {
        return this._role;
    }

    set role(value: "publisher" | "subscriber") {
        this._role = value;
    }

    get pluginClass(): Record<string, any> {
        return this._pluginClass;
    }

    set pluginClass(value: Record<string, any>) {
        this._pluginClass = value;
    }

}