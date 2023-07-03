import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";
import {ComponentInternalInstance} from "vue";
import {CommonService} from "@/common/service/CommonService";
import {Class} from "@/common/pojo/enum/Class";

export class DemoTestService extends CommonService<DemoTestService> {

    private _userName: string;
    private _password: string;

    public constructor(vue: ComponentInternalInstance | null) {
        super(vue);
        this._userName = "";
        this._password = "";
        this.once("test", () => {
            LogUtil.loggerLine(Log.of("TestService", "constructor", "msg", "on test"));
        });
    }

    public reset(): void {

    }

    public register(): void {

    }

    public login(): void {

    }

    public connect(): void {

    }

    public disconnect(): void {

    }

    public async test(): Promise<void> {
        this._userName = "Hello world!";
        this._password = "Hello world!";
        // this.service.userName = "Hello world!";
        // this.service.password = "Hello world!";
        LogUtil.loggerLine(Log.of("TestService", "test", "msg", "emit test"));
        this.emitAsync("test").then();
    }

    get userName(): string {
        return this._userName;
    }

    set userName(value: string) {
        this._userName = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    protected getClassName(): string {
        return Class.DemoTestService;
    }

    static get class(): string {
        return Class.DemoTestService;
    }

}