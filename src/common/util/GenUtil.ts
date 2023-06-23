import {DataUtil} from "@/common/util/DataUtil";
import {StreamInfo} from "@/common/pojo/dto/StreamInfo";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";

export class GenUtil {

    private constructor() {
    }

    public static async initBitrate(rtcDirec: string, streams: Array<StreamInfo>, transceiver?: RTCRtpTransceiver): Promise<void> {
        if (typeof transceiver === "undefined") return;
        let stream = <StreamInfo>streams.find(stream => stream.rtcDirec === rtcDirec);
        stream.bitrate.value = "0 kbits/sec";
        LogUtil.loggerLine(Log.of("GenUtil", "initBitrate", "transceiver", transceiver));
        if (stream.bitrate.timer) return;
        stream.bitrate.timer = setInterval(async () => {
            let stats = await transceiver.receiver.getStats();
            stats.forEach((res: Record<string, any>) => {
                if (!this.isIncomingMedia(res)) return;
                stream.bitrate.bsnow = res.bytesReceived;
                stream.bitrate.tsnow = res.timestamp;
                if (stream.bitrate.bsbefore === null || stream.bitrate.tsbefore === null) {
                    stream.bitrate.bsbefore = stream.bitrate.bsnow;
                    stream.bitrate.tsbefore = stream.bitrate.tsnow;
                } else {
                    let timePassed = <number>stream.bitrate.tsnow - stream.bitrate.tsbefore;
                    let bitRate = Math.round((<number>stream.bitrate.bsnow - stream.bitrate.bsbefore) * 8 / timePassed);
                    stream.bitrate.value = bitRate + ' kbits/sec';
                    stream.bitrate.bsbefore = stream.bitrate.bsnow;
                    stream.bitrate.tsbefore = stream.bitrate.tsnow;
                }
            });
            LogUtil.loggerLine(Log.of("GenUtil", "initBitrate", "bitrate.value", stream.bitrate.value));
        }, 1000);
    }

    private static isIncomingMedia(res: Record<string, any>): boolean {
        if ((res.mediaType === "video" || res.id.toLowerCase().indexOf("video") > -1) &&
            res.type === "inbound-rtp" && res.id.indexOf("rtcp") < 0) {
            return true;
        } else if (res.type == 'ssrc' && res.bytesReceived &&
            (res.googCodecName === "VP8" || res.googCodecName === "")) {
            return true;
        }
        return false;
    }

    public static timer(func: () => void, time: number): void {
        setTimeout(func, time);
    }

    public static sleep(waitTimeInMs: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, waitTimeInMs));
    }

    public static objToRecord<T>(obj: T): Record<string, any> {
        let recData: Record<string, any> = {};
        let methodNames = DataUtil.getPrototypes(obj);
        for (let methodName of methodNames) {
            recData[methodName] = obj[<keyof T>methodName];
        }
        return recData;
    }

    public static getUrlKey(key: string): string | undefined {
        let url = window.location.href;
        if (url.indexOf("?") !== -1) {
            let cs_str = url.split('?')[1];
            let cs_arr = cs_str.split('&');
            let cs: Record<string, any> = {};
            for (let i = 0; i < cs_arr.length; i++) {
                cs[cs_arr[i].split('=')[0]] = cs_arr[i].split('=')[1];
            }
            return (<Record<string, any>>cs)[key];
        }
        return '';
    }

}