import Animation from './animation';
import { Images } from './assets';
import BoundingBox from './boundingBox';
import Game from './game';
import World from './world';
import WorldTile from './worldTile';
import { workerData } from 'worker_threads';

export default class Bandit extends WorldTile {

    private slowTimeout: any;
    private defaultAnim: Animation = new Animation(/bandit_idle_anim/);
    private leanLAnim: Animation = new Animation(/bandit_lean_l_anim/);
    private leanRAnim: Animation = new Animation(/bandit_lean_r_anim/);
    private dustAnim: Animation = new Animation(/motorcycle_dust_anim/);

    public constructor(x: number, y: number) {
        super(new Animation(/bandit_idle_anim/), x, y, new Map([[Images.getImage(/bandit_idle_anim_000/), Images.getImage(/bandit_dead/)]]));
        this.z = 20;
    }

    public update(): void {
        if (Game.getInstance().getWorld().isPaused()) {
            return;
        }
        if (Math.abs(this.xOffset) <= 1) {
            this.xOffset = 0;
        } else {
            this.xOffset = this.xOffset / 2;
        }
        if (!this.isDestroyed()) {
            this.handleCollisions();
            if (this.slowTimeout) {
                this.y += Game.getInstance().getWorld().getSpeed() - 2;
            } else {
                this.y += Game.getInstance().getWorld().getSpeed() - 4;
            }
        } else {
            this.y += Game.getInstance().getWorld().getSpeed();
        }
    }

    public render(): void {
        if (this.animation != this.defaultAnim) {
            if (this.animation.isDone()) {
                this.animation.restart();
                this.animation = this.defaultAnim;
            }
        }
        super.render();
        if (!this.isDestroyed()) {
            let nextFrame: HTMLImageElement;
            if (Game.getInstance().getWorld().isPaused()) {
                nextFrame = this.dustAnim.getCurrentFrame();
            } else {
                nextFrame = this.dustAnim.getNextFrame();
            }
            super.renderImage(nextFrame, this.x + this.xOffset, this.y + 10);
        }
    }

    private handleCollisions(): void {
        Game.getInstance().getWorld().getTiles().forEach(t => {
            if (this === t) {
                return;
            }
            if (this.getBoundingBox().intersects(t.getBoundingBox())) {
                if (t.isSolid()) {
                    if (this.y < World.tileSize * World.tilesHigh - World.tileSize) {
                        Game.getInstance().getCamera().shake(1, 200);
                    }
                    this.destroy();
                } else if (t.isSlow()) {
                    this.slow();
                } else if (t.isHealth()) {
                    this.slow();
                    t.destroy();
                }
            }

            if (t.isSolid()) {
                if (t.getBoundingBox().pointIntersects(this.x + World.tileSize / 2, this.y - World.tileSize)) {
                    let tryDodge: boolean = Math.floor(Math.random() * 4) === 0;
                    if (tryDodge) {
                        let moveRight: boolean = Math.floor(Math.random() * 2) === 0;
                        if (moveRight) {
                            let rightBoundingBox: BoundingBox = new BoundingBox(this.x + World.tileSize, this.y, this.tilesWide * World.tileSize, this.tilesHigh * World.tileSize);
                            if (!this.checkCollision(rightBoundingBox) && this.x + World.tileSize < World.tileSize * World.tilesWide) {
                                this.x += World.tileSize;
                                this.xOffset -= World.tileSize;
                                this.animation = this.leanRAnim;
                            }
                        } else if (!moveRight) {
                            let leftBoundingBox: BoundingBox = new BoundingBox(this.x - World.tileSize, this.y, this.tilesWide * World.tileSize, this.tilesHigh * World.tileSize);
                            if (!this.checkCollision(leftBoundingBox) && this.x - World.tileSize >= 0) {
                                this.x -= World.tileSize;
                                this.xOffset += World.tileSize;
                                this.animation = this.leanLAnim;
                            }
                        }
                    }
                }
            }
        });
    }

    private checkCollision(newBoundingBox: BoundingBox): boolean {
        Game.getInstance().getWorld().getTiles().forEach(t => {
            if (this === t) {
                return;
            }
            if (newBoundingBox.intersects(t.getBoundingBox()) && t.isSolid()) {
                return true;
            }
        });
        return false;
    }

    public isSolid(): boolean {
        return !this.isDestroyed();
    }

    public getDamageAmount(): number {
        return 1;
    }

    public isScore(): boolean {
        return !this.isDestroyed();
    }

    public isFlat(): boolean {
        return false;
    }

    public getScoreAmount(): number {
        return 10;
    }

    private slow(): void {
        if (this.slowTimeout) {
            clearTimeout(this.slowTimeout);
        }
        this.slowTimeout = setTimeout(() => this.slowTimeout = null, 1000);
    }
}
