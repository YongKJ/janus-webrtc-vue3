import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";
import {ComponentInternalInstance} from "vue";
import {CommonService} from "@/common/service/CommonService";
import {Class} from "@/common/pojo/enum/Class";

export class DemoTestService extends CommonService<DemoTestService> {

    public constructor(vue: ComponentInternalInstance | null) {
        super(vue);
        this.once("test", () => {
            LogUtil.loggerLine(Log.of("TestService", "constructor", "msg", "on test"));
        });
    }

    public async test(): Promise<void> {
        LogUtil.loggerLine(Log.of("TestService", "test", "msg", "emit test"));
        this.emitAsync("test").then();
    }

    protected getClassName(): string {
        return Class.DemoTestService;
    }

    static get class(): string {
        return Class.DemoTestService;
    }

}