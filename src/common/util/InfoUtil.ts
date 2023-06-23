import {Socket} from "socket.io-client/build/esm/socket";
import {io} from "socket.io-client";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";

export class InfoUtil {

    private readonly infoClient: Socket;
    private readonly mapSubscriber: Map<string, boolean>;

    public constructor(url: string, api: string) {
        this.infoClient = InfoUtil.getInfoClient(url, api);
        this.mapSubscriber = new Map<string, boolean>();
        this.infoClient.connect();
    }

    private static getInfoClient(url: string, api: string): Socket {
        return io(url, {
            path: api,
            transports: ["websocket"],
        });
    }

    public sendInfo(event: string, reqData?: string | Record<string, any>, infoFunc?: (...data: any[]) => void): void {
        if (typeof infoFunc !== "undefined") {
            this.subscribeEvent(event, infoFunc);
        }
        if (typeof reqData === "undefined") return;
        this.infoClient.emit(event, reqData);
    }

    private subscribeEvent(event: string, infoFunc?: (...data: any[]) => void): void {
        if (this.mapSubscriber.has(event)) return;
        this.mapSubscriber.set(event, true);
        this.infoClient.on(event, typeof infoFunc !== "undefined" ? infoFunc : message => {
            LogUtil.loggerLine(Log.of("InfoUtil", "subscribeEvent", "message", message));
        });
    }

    private finishSubscribe(event: string): void {
        if (!this.mapSubscriber.has(event)) return;
        this.infoClient.off(event);
    }

    public closeInfoClient(): void {
        this.infoClient.disconnect();
    }

}