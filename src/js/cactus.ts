import WorldTile from './worldTile';
import { Images } from './assets';

export default class Cactus extends WorldTile {
    private static images: HTMLImageElement[] = [ Images.cactus ];
    private static destroyMap: Map<HTMLImageElement, HTMLImageElement> = new Map([
        [ Images.cactus, Images.cactusDead ]
    ]);
    
    private isDestroyed: boolean = false;

    public constructor(x: number, y: number) {
        super(Cactus.images, x, y);
    }

    public isHealth(): boolean {
        return !this.isDestroyed;
    }

    public destroy(): void {
        this.isDestroyed = true;
        super.setImage(Cactus.destroyMap.get(super.getImage()));
    }
}
