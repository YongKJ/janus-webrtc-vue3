import {Global} from "@/common/config/Global";
import {Log} from "@/common/pojo/dto/Log";

export class LogUtil {

    private static readonly enable = Global.LOG_ENABLE;

    public static loggerLine(log: Log): void {
        if (this.enable) {
            console.log("[" + log.className + "] " + log.methodName + " -> " + log.paramName + ": ", log.value);
        }
    }

    public static logger(log: Log): void {
        if (this.enable) {
            console.log("\n[" + log.className + "] " + log.methodName + " -> " + log.paramName + ": ", log.value);
        }
    }

}