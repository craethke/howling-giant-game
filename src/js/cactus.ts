import WorldTile from './worldTile';
import Animation from './animation';
import { Images } from './assets';

export default class Cactus extends WorldTile {
    private static images: HTMLImageElement[] = [Images.getImage(/cactus/)];
    private static destroyMap: Map<HTMLImageElement, HTMLImageElement> = new Map([
        [Images.getImage(/cactus/), Images.getImage(/cactus_dead/)]
    ]);

    public constructor(x: number, y: number) {
        super(Cactus.images, x, y, Cactus.destroyMap, new Animation(/cactus_death_anim/));
    }

    public isHealth(): boolean {
        return !this.isDestroyed();
    }

    public isFlat(): boolean {
        return false;
    }
}
