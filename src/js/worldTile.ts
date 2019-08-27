import Drawable from './drawable';
import World from './world';
import BoundingBox from './boundingBox';
import Animation from './animation';
import Game from './game';

export default class WorldTile extends Drawable {

    public tilesWide: number;
    public tilesHigh: number;
    private image: HTMLImageElement;
    private animation: Animation;
    private destroyMap: Map<HTMLImageElement, HTMLImageElement>;
    private deathAnimation: Animation;
    private destroyed: boolean = false;

    public constructor(imagesOrAnimation: any, x: number, y: number, destroyMap?: Map<HTMLImageElement, HTMLImageElement>, deathAnimation?: Animation) {
        super();
        if (imagesOrAnimation instanceof Array && imagesOrAnimation.every(i => i instanceof HTMLImageElement)) {
            this.image = this.randomImage(imagesOrAnimation);
        } else if (imagesOrAnimation instanceof Animation) {
            this.animation = imagesOrAnimation;
            this.image = this.animation.getCurrentFrame();
        } else {
            throw new Error('imagesOrAnimation must be HTMLImageElement[] or Animation');
        }
        this.x = x;
        this.y = y;
        this.tilesWide = 1;
        this.tilesHigh = 1;
        this.destroyMap = destroyMap;
        this.deathAnimation = deathAnimation;
    }

    public render(): void {
        let drawImage;

        if (this.destroyed && this.deathAnimation && !this.deathAnimation.isDone()) {
            if (Game.getInstance().getWorld().isPaused()) {
                drawImage = this.deathAnimation.getCurrentFrame();
            } else {
                drawImage = this.deathAnimation.getNextFrame();
            }
        } else if (this.destroyed) {
            drawImage = this.destroyMap.get(this.getImage());
        } else if (this.animation) {
            if (Game.getInstance().getWorld().isPaused()) {
                drawImage = this.animation.getCurrentFrame();
            } else {
                drawImage = this.animation.getNextFrame();
            }
        } else {
            drawImage = this.image;
        }
        
        let yImageAdjust = drawImage.height - World.tileSize;
        super.renderImage(drawImage, this.x, this.y - yImageAdjust);
    }

    public getBoundingBox(): BoundingBox {
        return new BoundingBox(this.x, this.y, this.tilesWide * World.tileSize, this.tilesHigh * World.tileSize);
    }

    public isSolid(): boolean {
        return false;
    }

    public getDamageAmount(): number {
        return 0;
    }

    public isHealth(): boolean {
        return false;
    }

    public isSlow(): boolean {
        return false;
    }

    public isDestroyed(): boolean {
        return this.destroyed;
    }

    public destroy(): void {
        this.destroyed = true;
    }

    public setX(x: number): void {
        this.x = x;
    }

    public setY(y: number): void {
        this.y = y;
    }

    protected getImage(): HTMLImageElement {
        return this.image;
    }

    protected setImage(image: HTMLImageElement): void {
        this.image = image;
    }

    private randomImage(images: HTMLImageElement[]): HTMLImageElement {
        return images[Math.floor(Math.random() * images.length)];
    }
}
