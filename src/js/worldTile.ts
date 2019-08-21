import Drawable from './drawable';
import World from './world';
import BoundingBox from './boundingBox';

export default class WorldTile extends Drawable {

    public tilesWide: number;
    public tilesHigh: number;
    private image: HTMLImageElement;

    public constructor(images: HTMLImageElement[], x: number, y: number) {
        super();
        this.image = this.randomImage(images);
        this.x = x;
        this.y = y;
        this.tilesWide = 1;
        this.tilesHigh = 1;
    }

    public render(): void {
        let yImageAdjust = this.image.height - World.tileSize;
        super.renderImage(this.image, this.x, this.y - yImageAdjust);
    }

    public getBoundingBox(): BoundingBox {
        return new BoundingBox(this.x, this.y, this.tilesWide * World.tileSize, this.tilesHigh * World.tileSize);
    }

    public isSolid(): boolean {
        return false;
    }

    public isHealth(): boolean {
        return false;
    }

    public isSlow(): boolean {
        return false;
    }

    public destroy(): void {
        // Do nothing
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
