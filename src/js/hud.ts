import Drawable from "./drawable";
import Game from "./game";
import { Images } from "./assets";
import { runInThisContext } from "vm";
import Animation from './animation';

export default class Hud extends Drawable {

    private static heartMap: { [index: number] : HTMLImageElement } = {
        0: Images.hudHeartEmpty,
        1: Images.hudHeartHalf,
        2: Images.hudHeartFull
    }

    private defaultAnim: Animation = new Animation(/hud_default_anim/);
    private damageAnim: Animation = new Animation(/hud_damage_anim/);
    private currentAnim = this.defaultAnim;

    public constructor() {
        super();
        this.x = 0;
        this.y = 0;
    }

    public renderHearts(): void {
        let healthHalfs = Game.getInstance().getTruck().getHealth() * 2;
        for (let i: number = 0; i < 3; i++) {
            let index: number = Math.max(0, Math.min(2, healthHalfs - i * 2))
            let drawX: number = this.x + 26 + i * 12;
            let drawY = this.y + 6;
            super.renderImage(Hud.heartMap[index], drawX, drawY);
        }
    }
    
    public render(): void {
        if (this.currentAnim !== this.defaultAnim && this.currentAnim.isDone()) {
            this.currentAnim = this.defaultAnim;
        }
        let nextFrame;
        if (Game.getInstance().getWorld().isPaused()) {
            nextFrame = this.currentAnim.getCurrentFrame();
        } else {
            nextFrame = this.currentAnim.getNextFrame();
        }
        super.renderImage(nextFrame, this.x + 2, this.y + 2);
        super.renderImage(Images.hudHeartbar, this.x + 26, this.y + 10);
        super.renderImage(Images.hudHeartFull, this.x + 26, this.y + 6);
        super.renderImage(Images.hudHeartFull, this.x + 38, this.y + 6);
        super.renderImage(Images.hudHeartFull, this.x + 50, this.y + 6);
        this.renderHearts();
    }

    public startDamageAnim(): void {
        this.damageAnim.restart();
        this.currentAnim = this.damageAnim;
    }
}
