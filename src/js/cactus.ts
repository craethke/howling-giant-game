import WorldTile from './worldTile';
import Animation from './animation';
import { Images } from './assets';

export default class Cactus extends WorldTile {
    private static images: HTMLImageElement[] = [ Images.cactus ];
    private static destroyMap: Map<HTMLImageElement, HTMLImageElement> = new Map([
        [ Images.cactus, Images.cactusDead ]
    ]);
    
    public constructor(x: number, y: number) {
        super(Cactus.images, x, y, Cactus.destroyMap, new Animation(/cactus_death_anim/));
    }

    public isHealth(): boolean {
        return !this.isDestroyed();
    }
}
