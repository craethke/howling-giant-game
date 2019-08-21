import Drawable from './drawable';
import World from './world';
import { Images } from './assets';
import { runInThisContext } from 'vm';
import Game from './game';
import BoundingBox from './boundingBox';
import App from './app';

export default class Truck extends Drawable {

    private static readonly MAX_HEALTH: number = 3;

    private game: Game;
    private tilesHigh: number = 2;
    private tilesWide: number = 1;
    private health: number = 3;

    constructor(game: Game) {
        super();
        this.game = game;
        this.x = World.tileSize * (World.tilesWide / 2);
        this.y = World.tileSize * (World.tilesHigh - 2 - this.tilesHigh);
        window.addEventListener('keydown', this.handleKeyboardEvent.bind(this));
        window.addEventListener('touchmove', this.handleTouchEvent.bind(this));
    }

    public getHealth(): number {
        return this.health;
    }

    public update(): void {
        this.handleCollisions();
    }

    public render(): void {
        super.renderImage(Images.truck, this.x, this.y);
        super.renderImage(Images.dust, this.x - World.tilesWide / 2, this.y + World.tileSize * this.tilesHigh);
        super.renderImage(Images.dust, this.x + World.tilesWide / 2, this.y + World.tileSize * this.tilesHigh);
    }

    private handleCollisions(): void {
        this.game.getWorld().getTiles().forEach(t => {
            if (this.getBoundingBox().intersects(t.getBoundingBox())) {
                if (t.isSolid()) {
                    this.game.getWorld().slow();
                    this.health = Math.max(0, this.health - 1);
                    t.destroy();
                } else if (t.isHealth()) {
                    this.health = Math.min(this.health + .5, Truck.MAX_HEALTH);
                    t.destroy();
                } else if (t.isSlow()) {
                    this.game.getWorld().slow();
                }
            }
        });
    }

    private handleKeyboardEvent(e: KeyboardEvent): void {
        switch (e.key) {
            case 'a':
                this.x -= World.tileSize;
                break;
            case 'd':
                this.x += World.tileSize;
                break;
        }
        this.x = Math.max(0, Math.min(World.tileSize * (World.tilesWide - 1), this.x));

        e.preventDefault();
    }

    private handleTouchEvent(e: TouchEvent): void {
        let touchX: number = e.touches[0].clientX;
        let canvasX: number = this.canvas.offsetLeft;
        let newX = (touchX - canvasX) / 2;
        this.x = Math.floor(newX / World.tileSize) * World.tileSize;
        this.x = Math.max(0, Math.min(World.tileSize * (World.tilesWide - 1), this.x));

        e.preventDefault();
    }

    private getBoundingBox(): BoundingBox {
        return new BoundingBox(this.x, this.y, this.tilesWide * World.tileSize, this.tilesHigh * World.tileSize);
    }
}
