import Animation from './animation';
import { Images } from './assets';
import Drawable from './drawable';
import Game from './game';
import { Mode } from './game';
import World from './world';

export default class Hud extends Drawable {

    private static heartMap: { [index: number]: HTMLImageElement } = {
        0: Images.getImage(/hud_heart_empty/),
        1: Images.getImage(/hud_heart_half/),
        2: Images.getImage(/hud_heart_full/)
    }

    private defaultAnim: Animation = new Animation(/hud_default_anim/);
    private damageAnim: Animation = new Animation(/hud_damage_anim/);
    private flagAnim: Animation = new Animation(/hud_flag_idle_anim/);
    private arrowAnim: Animation = new Animation(/hud_distance_meter_arrow_anim/);
    private currentAnim = this.defaultAnim;

    public constructor() {
        super();
        this.x = 0;
        this.y = -100;
    }

    public renderHearts(): void {
        let healthHalfs = Game.getInstance().getTruck().getHealth() * 2;
        for (let i: number = 0; i < 3; i++) {
            let index: number = Math.max(0, Math.min(2, healthHalfs - i * 2))
            let drawX: number = this.x + 26 + i * 12;
            let drawY = this.y + 6;
            super.renderHudImage(Hud.heartMap[index], drawX, drawY);
        }
    }

    public update(): void {
        if (Game.getInstance().isWon()) {
            this.y -= 1;
        } else {
            if (this.y < 0) {
                this.y += 2;
            }
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
        super.renderHudImage(nextFrame, this.x + 2, this.y + 2);
        super.renderHudImage(Images.getImage(/hud_heartbar/), this.x + 26, this.y + 10);
        super.renderHudImage(Images.getImage(/hud_heart_full/), this.x + 26, this.y + 6);
        super.renderHudImage(Images.getImage(/hud_heart_full/), this.x + 38, this.y + 6);
        super.renderHudImage(Images.getImage(/hud_heart_full/), this.x + 50, this.y + 6);
        this.renderHearts();

        switch (Game.getInstance().getMode()) {
            case Mode.SURVIVE:
                this.renderDistanceMeter();
                break;
            case Mode.SCORE:
                this.renderScoreMeter();
                break;
        }

    }

    public startDamageAnim(): void {
        this.damageAnim.restart();
        this.currentAnim = this.damageAnim;
    }

    private renderDistanceMeter(): void {
        super.renderHudImage(Images.getImage(/hud_distance_bar/), this.x + 95, this.y + 2);

        let distanceMeterWidth: number = Images.getImage(/hud_distance_meter/).width;
        let distanceMeterHeight: number = Images.getImage(/hud_distance_meter/).height;
        super.renderHudImagePartial(
            Images.getImage(/hud_distance_indicator/),
            this.x + 97,
            this.y + 13,
            Math.floor(distanceMeterWidth * this.getDistancePercent()) + 1,
            distanceMeterHeight);
        super.renderHudImagePartial(
            Images.getImage(/hud_distance_meter/),
            this.x + 97,
            this.y + 13,
            Math.floor(distanceMeterWidth * this.getDistancePercent()),
            distanceMeterHeight);
        super.renderHudImage(this.arrowAnim.getNextFrame(), this.x + 95 + Math.floor(distanceMeterWidth * this.getDistancePercent()), this.y + 8);
        super.renderHudImage(this.flagAnim.getNextFrame(), this.x + 142, this.y + 6);
    }

    private renderScoreMeter(): void {
        super.renderHudImage(Images.getImage(/hud_distance_bar/), this.x + 95, this.y + 2);
        super.renderHudImage(Images.getImage(/hud_score_bar/), this.x + 85, this.y + 12);
        super.renderHudImage(this.flagAnim.getNextFrame(), this.x + 142, this.y + 6);
        let score: string = Game.getInstance().getCurrentScore().toString();
        score = score.padStart(5, '0');
        //super.renderText(score, this.x + 95, this.y + 9);
        let scoreX = this.x + 87;
        let scoreY = this.y + 9;
        for (let i: number = 0; i < score.length; i++) {
            super.renderLetter(score.charAt(i), scoreX + i * 11, scoreY);
        }
    }

    private getDistancePercent(): number {
        return Game.getInstance().getCurrentTime() / World.gameWinTime;
    }

    private getScore(): number {
        return Math.floor(Game.getInstance().getCurrentTime() / 1000);
    }
}
