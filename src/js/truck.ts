import Drawable from './drawable';
import World from './world';
import { Images } from './assets';
import { runInThisContext } from 'vm';
import Game from './game';
import BoundingBox from './boundingBox';
import App from './app';
import Animation from './animation';
import TouchUtils from './touchUtils';

export default class Truck extends Drawable {

    private static readonly MAX_HEALTH: number = 3;

    private tilesHigh: number = 2;
    private tilesWide: number = 1;
    private health: number = 3;
    private defaultAnim: Animation = new Animation(/truck_default_anim/);
    private leanLAnim: Animation = new Animation(/truck_lean_l_anim/);
    private leanRAnim: Animation = new Animation(/truck_lean_r_anim/);
    private dustAnim: Animation = new Animation(/dust_anim/);
    private currentAnim: Animation = this.defaultAnim;

    constructor() {
        super();
        this.x = World.tileSize * (World.tilesWide / 2);
        this.y = World.tileSize * (World.tilesHigh - this.tilesHigh + 1);
        this.z = 2;
        window.addEventListener('keydown', this.handleKeyboardEvent.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchEvent.bind(this));
    }

    public getHealth(): number {
        return this.health;
    }

    public update(): void {
        this.handleCollisions();
    }

    public render(): void {
        if (this.currentAnim != this.defaultAnim) {
            if (this.currentAnim.isDone()) {
                this.currentAnim.restart();
                this.currentAnim = this.defaultAnim;
            }
        }
        let drawFrame;
        if (Game.getInstance().getWorld().isPaused()) {
            drawFrame = this.currentAnim.getCurrentFrame();
        } else {
            drawFrame = this.currentAnim.getNextFrame();
        }
        super.renderImage(drawFrame, this.x, this.y - 2 * World.tileSize);
    }

    public renderDust(): void {
        let drawFrame;
        if (Game.getInstance().getWorld().isPaused()) {
            drawFrame = this.dustAnim.getCurrentFrame();
        } else {
            drawFrame = this.dustAnim.getNextFrame();
        }
        super.renderImage(drawFrame, this.x - World.tilesWide / 2, this.y);
        super.renderImageFlipped(drawFrame, this.x + World.tilesWide / 2, this.y);
    }

    private handleCollisions(): void {
        Game.getInstance().getWorld().getTiles().forEach(t => {
            if (this.getBoundingBox().intersects(t.getBoundingBox())) {
                if (t.isSolid()) {
                    Game.getInstance().getWorld().slow();
                    Game.getInstance().getHud().startDamageAnim();
                    this.health = Math.max(0, this.health - t.getDamageAmount());
                    t.destroy();
                } else if (t.isHealth()) {
                    this.health = Math.min(this.health + .5, Truck.MAX_HEALTH);
                    t.destroy();
                } else if (t.isSlow()) {
                    Game.getInstance().getWorld().slow();
                }
            }
        });
        if (this.health === 0) {
            Game.getInstance().getWorld().pause();
            Game.getInstance().gameOver();
        }
    }

    private handleKeyboardEvent(e: KeyboardEvent): void {
        if (Game.getInstance().getWorld().isPaused() || Game.getInstance().isGameOver()) {
            return;
        }
        switch (e.key) {
            case 'a':
            case 'ArrowLeft':
                this.x -= World.tileSize;
                this.currentAnim = this.leanLAnim;
                this.currentAnim.restart();
                break;
            case 'd':
            case 'ArrowRight':
                this.x += World.tileSize;
                this.currentAnim = this.leanRAnim;
                this.currentAnim.restart();
                break;
        }
        this.boundPosition();

        e.preventDefault();
    }

    private handleTouchEvent(e: TouchEvent): void {
        if (Game.getInstance().getWorld().isPaused()) {
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
