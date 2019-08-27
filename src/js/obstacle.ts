import WorldTile from './worldTile';
import { Images } from './assets';

export default class Obstacle extends WorldTile {

    private static images: HTMLImageElement[] = [ Images.rockA, Images.rockB ];
    private static destroyMap: Map<HTMLImageElement, HTMLImageElement> = new Map([
        [ Images.rockA, Images.getImage(/rock_a_dead/) ],
        [ Images.rockB, Images.getImage(/rock_b_dead/) ]
    ]);
    
    public constructor(x: number, y: number) {
        super(Obstacle.images, x, y, Obstacle.destroyMap);
    }

    public isSolid(): boolean {
        return !this.isDestroyed();
    }

    public getDamageAmount(): number {
        return this.getImage() === Images.rockA ? .5 : 1;
    }
}
