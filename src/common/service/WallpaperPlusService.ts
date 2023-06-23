import {CommonService} from "@/common/service/CommonService";
import {ComponentInternalInstance} from "vue";
import {Class} from "@/common/pojo/enum/Class";
import {loadFull} from "tsparticles";
import {Container, Engine} from "tsparticles-engine";
import {LogUtil} from "@/common/util/LogUtil";
import {Log} from "@/common/pojo/dto/Log";
import {ParticlesOptions} from "@/common/pojo/po/ParticlesOptions";
import {GenUtil} from "@/common/util/GenUtil";
import {debounce} from "lodash-es";

export class WallpaperPlusService extends CommonService<WallpaperPlusService> {

    public constructor(vue: ComponentInternalInstance | null) {
        super(vue);
    }

    public initData(): void {
        this.watchResizeEvent();
    }

    private watchResizeEvent(): void {
        window.addEventListener("resize", debounce(async () => {
            let screenHeight = document.documentElement.clientHeight + "px";
            LogUtil.loggerLine(Log.of("WallpaperService", "setScrollbarHeightResize", "screenHeight", screenHeight));
            do {
                WallpaperPlusService.setStyleHeight(screenHeight);
                await GenUtil.sleep(340);
                LogUtil.loggerLine(Log.of("WallpaperService", "setScrollbarHeightResize", "styleHeight", WallpaperPlusService.styleHeight()));
            } while (screenHeight !== WallpaperPlusService.styleHeight());
        }, 340))
    }

    private static setStyleHeight(screenHeight: string): void {
        const scroller = <HTMLDivElement>document.getElementsByClassName("scrollbar__scroller")[0];
        scroller.setAttribute("style", "height: " + screenHeight);
    }

    private static styleHeight(): string {
        const scroller = <HTMLDivElement>document.getElementsByClassName("scrollbar__scroller")[0];
        return scroller.style.height;
    }

    public getParticlesConfig(): Record<string, any> {
        return ParticlesOptions.STYLE_ONE;
    }

    public async particlesInit(engine: Engine): Promise<void> {
        await loadFull(engine);
    }

    public async particlesLoaded(container: Container): Promise<void> {
        LogUtil.loggerLine(Log.of("AnimatedWallpaperService", "particlesLoaded", "container", container));
    }

    private static scrollByHorizontal(): void {
        let screenWidth = document.documentElement.clientWidth;
        if (screenWidth < 1920) {
            const scroller = document.getElementsByClassName("scrollbar__scroller");

            if (scroller.length == 1) {
                scroller[0].scrollLeft = (1920 - screenWidth) / 2;
            }
        }
    }

    public getScrollbarHeightStyle(): Record<string, any> {
        let screenHeight = document.documentElement.clientHeight;
        return {
            height: screenHeight + "px",
        };
    }

    public getMainWidthStyle(): Record<string, any> {
        let screenWidth = document.documentElement.clientWidth;
        return {
            width: screenWidth + "px"
        };
    }

    public getBgImgStyle(bgImg: string): Record<string, any> {
        return {
            backgroundImage: 'url(' + bgImg + ')'
        };
    }

    protected getClassName(): string {
        return Class.WallpaperPlusService;
    }

    static get class(): string {
        return Class.WallpaperPlusService;
    }

}