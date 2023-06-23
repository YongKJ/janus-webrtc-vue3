import Janode from '@/common/module/janode/janode';
import VideoRoomPlugin from "@/common/module/janode/plugins/videoroom-plugin";
import StreamingPlugin from "@/common/module/janode/plugins/streaming-plugin";
import AudioBridgePlugin from "@/common/module/janode/plugins/audiobridge-plugin";
import {JanusClient} from "@/common/pojo/dto/JanusClient";
import {JanusPlugin} from "@/common/pojo/dto/JanusPlugin";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";

export class JanusUtil {

    private static readonly mapClient = new Map<string, JanusClient>();

    public constructor(url: string, type: "video" | "audio" | "stream", taskFunc?: () => void) {
        this.initData(url, type).then(() => {
            if (typeof taskFunc === "undefined") return;
            taskFunc();
        });
    }

    public static async getPlugin(id: string | number, type: "video" | "audio" | "stream", role: "publisher" | "subscriber"): Promise<JanusPlugin> {
        switch (type) {
            case "audio":
                return JanusPlugin.get(id, role, type, AudioBridgePlugin);
            case "video":
                return JanusPlugin.get(id, role, type, VideoRoomPlugin);
            case "stream":
                return JanusPlugin.get(id, role, type, StreamingPlugin);
            default:
                return new JanusPlugin();
        }
    }

    public static async getJanusPlugin(pluginClass: Record<string, any>, type: string): Promise<Record<string, any>> {
        return (<JanusClient>JanusUtil.mapClient.get(type)).session?.attach(pluginClass);
    }

    public async initData(url: string, type: string): Promise<void> {
        let connection = <Record<string, any>><unknown>await Janode.connect({
            is_admin: false,
            address: {
                url: url
            }
        });
        let session = <Record<string, any>><unknown>await connection?.create();
        JanusUtil.mapClient.set(type, JanusClient.of(connection, session));
    }

    public async sendInfo(plugin: JanusPlugin, event: string, reqData?: string | Record<string, any> | null, taskFunc?: (data: Record<string, any>) => void): Promise<Record<string, any>> {
        if (typeof taskFunc !== "undefined") {
            this.subscribeEvent(plugin, event, taskFunc);
        }
        if (typeof reqData === "undefined") return {};
        return plugin.plugin[event](reqData);
    }

    private subscribeEvent(plugin: JanusPlugin, event: string, taskFunc?: (data: Record<string, any>) => void): void {
        let eventName = plugin.pluginClass?.EVENT[event];
        if (plugin.events.includes(eventName)) return;
        plugin.events.push(eventName);
        plugin.plugin.on(eventName, typeof taskFunc !== "undefined" ? taskFunc : (data: Record<string, any>) => {
            LogUtil.loggerLine(Log.of("JanusUtil", "subscribeEvent", "data", data));
        });
    }

    public async detachPlugin(plugin?: JanusPlugin, isLeaving?: boolean): Promise<void> {
        if (isLeaving) {
            await plugin?.plugin?.detach();
            plugin?.peer?.close();
            return;
        }
        if (plugin?.type === "video" && plugin?.role === "publisher") {
            await plugin?.plugin?.unpublish();
        }
        if (plugin?.type === "video" && plugin?.role === "subscriber") {
            await plugin?.plugin?.pause();
        }
        plugin?.peer?.close();
        await plugin?.plugin?.leave();
        await plugin?.plugin?.detach();
    }

    public static async closeConnection(type: "video" | "audio" | "stream"): Promise<void> {
        LogUtil.loggerLine(Log.of("JanusUtil", "closeConnection", "client", JanusUtil.mapClient.get(type)));
        await (<JanusClient>JanusUtil.mapClient.get(type)).session?.destroy();
        await (<JanusClient>JanusUtil.mapClient.get(type)).connection?.close();
        JanusUtil.mapClient.delete(type);
    }

}