import WorldTile from './worldTile';
import { Images } from './assets';

export default class Obstacle extends WorldTile {

    private static images: HTMLImageElement[] = [ Images.rockA, Images.rockB ];
    private static destroyMap: Map<HTMLImageElement, HTMLImageElement> = new Map([
        [ Images.rockA, Images.groundRockA ],
        [ Images.rockB, Images.groundRockB ]
    ]);
    
    private isDestroyed: boolean = false;

    public constructor(x: number, y: number) {
        super(Obstacle.images, x, y);
    }

    public isSolid(): boolean {
        return !this.isDestroyed;
    }

    public destroy(): void {
        this.isDestroyed = true;
        super.setImage(Obstacle.destroyMap.get(super.getImage()));
    }
}
