import Animation from './animation';
import BoundingBox from './boundingBox';
import Drawable from './drawable';
import Game from './game';
import TouchUtils from './touchUtils';
import World from './world';

export default class Truck extends Drawable {

    private static readonly MAX_HEALTH: number = 3;

    private tilesHigh: number = 2;
    private tilesWide: number = 1;
    private health: number = 3;
    private shrinkPauseDuration: number = 1000;
    private shrinkPauseStart: number;
    private defaultAnim: Animation = new Animation(/truck_default_anim/);
    private leanLAnim: Animation = new Animation(/truck_lean_l_anim/);
    private leanRAnim: Animation = new Animation(/truck_lean_r_anim/);
    private dustAnim: Animation = new Animation(/\/dust_anim/);
    private shrinkAnim: Animation = new Animation(/truck_fall_anim/);
    private currentAnim: Animation = this.defaultAnim;
    private isShrunk: boolean = false;
    private lastCollisionTime: number = -99999;
    private xOffset: number = 0;
    private yOffset: number = 0;

    constructor() {
        super();
        this.x = World.tileSize * (World.tilesWide / 2);
        this.y = World.tileSize * (World.tilesHigh + this.tilesHigh + 1);
        this.z = 2;
        window.addEventListener('keydown', this.handleKeyboardEvent.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchEvent.bind(this));
    }

    public getHealth(): number {
        return this.health;
    }

    public update(): void {
        if (Math.abs(this.xOffset) <= 1) {
            this.xOffset = 0;
        } else {
            this.xOffset = this.xOffset * .25;
        }
        if (Game.getInstance().isWon()) {
            let centerX = World.tileSize * World.tilesWide / 2 - World.tileSize / 2;
            if (this.x > centerX) {
                this.x -= 1;
            } else if (this.x < centerX) {
                this.x += 1;
            }
            this.handleCollisions();
        }
        if (Game.getInstance().isStarted()) {
            if (this.y > World.tileSize * (World.tilesHigh - this.tilesHigh + 1)) {
                this.y -= 2;
            }
            this.handleCollisions();
        }
    }

    public render(): void {
        if (this.currentAnim != this.defaultAnim) {
            if (this.currentAnim.isDone() && !(this.currentAnim === this.shrinkAnim)) {
                this.currentAnim.restart();
                this.currentAnim = this.defaultAnim;
            }
        }
        let drawFrame;
        if (!Game.getInstance().getWorld().isPaused()
            || (this.currentAnim === this.shrinkAnim && !this.shrinkPauseStart)) {
            drawFrame = this.currentAnim.getNextFrame();
        } else {
            drawFrame = this.currentAnim.getCurrentFrame();
        }
        if (Game.getInstance().getCurrentTime() - this.lastCollisionTime < 500 && Math.floor((Game.getInstance().getCurrentTime() - this.lastCollisionTime) / 100) % 2 == 0) {
            return;
        }
        if (!this.isShrunk) {
            super.renderImage(drawFrame, this.x + this.xOffset, this.y + this.yOffset - 2 * World.tileSize);
        }
    }

    public renderDust(): void {
        let drawFrame;
        if (this.currentAnim === this.shrinkAnim) {
            return;
        }
        if (Game.getInstance().getWorld().isPaused()) {
            drawFrame = this.dustAnim.getCurrentFrame();
        } else {
            drawFrame = this.dustAnim.getNextFrame();
        }
        super.renderImage(drawFrame, this.x - World.tilesWide / 2 + this.xOffset, this.y);
        super.renderImageFlipped(drawFrame, this.x + World.tilesWide / 2 + this.xOffset, this.y);
    }

    public setY(y: number) {
        this.y = y;
    }

    private handleCollisions(): void {
        Game.getInstance().getWorld().getTiles().forEach(t => {
            if (this.getBoundingBox().intersects(t.getBoundingBox())) {
                if (t.isScore()) {
                    Game.getInstance().addScore(t.getScoreAmount());
                }
                if (t.isSolid()) {
                    Game.getInstance().getWorld().slow();
                    Game.getInstance().getHud().startDamageAnim();
                    this.health = Math.max(0, this.health - t.getDamageAmount());
                    t.destroy();
                    Game.getInstance().getCamera().shake(1, 250);
                    this.lastCollisionTime = Game.getInstance().getCurrentTime();
                } else if (t.isHealth()) {
                    this.health = Math.min(this.health + .5, Truck.MAX_HEALTH);
                    t.destroy();
                } else if (t.isSlow()) {
                    Game.getInstance().getWorld().slow();
                } else if (t.isCanyonBottom()) {
                    this.pauseAndShrink();
                }
            }
        });
        if (this.health === 0 && !Game.getInstance().isGameOver()) {
            Game.getInstance().getWorld().pause();
            Game.getInstance().gameOver();
        }
    }

    private pauseAndShrink() {
        Game.getInstance().getWorld().pause();

        if (!this.shrinkPauseStart && !(this.currentAnim === this.shrinkAnim)) {
            this.shrinkPauseStart = Game.getInstance().getCurrentTime();
            this.currentAnim = this.shrinkAnim;
        }

        if (Game.getInstance().getCurrentTime() > this.shrinkPauseStart + this.shrinkPauseDuration) {
            this.shrinkPauseStart = undefined;
        }

        if (this.currentAnim.isDone()) {
            this.isShrunk = true;
        }
    }

    private handleKeyboardEvent(e: KeyboardEvent): void {
        if (Game.getInstance().getWorld().isPaused() || !Game.getInstance().isStarted()) {
            return;
        }
        switch (e.key) {
            case 'a':
            case 'ArrowLeft':
                this.x -= World.tileSize;
                this.xOffset += World.tileSize;
                this.currentAnim = this.leanLAnim;
                this.currentAnim.restart();
                break;
            case 'd':
            case 'ArrowRight':
                this.x += World.tileSize;
                this.xOffset -= World.tileSize;
                this.currentAnim = this.leanRAnim;
                this.currentAnim.restart();
                break;
        }
        this.boundPosition();

        e.preventDefault();
    }

    private handleTouchEvent(e: TouchEvent): void {
        if (Game.getInstance().getWorld().isPaused() || !Game.getInstance().isStarted()) {
            return;
        }
        let touchX = TouchUtils.getTouchX(e);
        this.x = Math.floor(touchX / World.tileSize) * World.tileSize;
        this.boundPosition();

        e.preventDefault();
    }

    private boundPosition(): void {
        this.x = Math.max(0, Math.min(World.tileSize * (World.tilesWide - 1), this.x));
    }

    private getBoundingBox(): BoundingBox {
        return new BoundingBox(this.x, this.y - 2 * World.tileSize, this.tilesWide * World.tileSize, this.tilesHigh * World.tileSize);
    }
}
