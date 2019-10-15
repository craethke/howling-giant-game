import WorldTile from './worldTile';
import { Images } from './assets';
import World from './world';

export default class Obstacle extends WorldTile {

    private static images: HTMLImageElement[] = []
        .concat(new Array(10).fill(Images.getImage(/rock\/rock_a/)))
        .concat(new Array(10).fill(Images.getImage(/rock\/rock_b/)))
        .concat(new Array(1).fill(Images.getImage(/rock\/rock_c_l/)));

    private static destroyMap: Map<HTMLImageElement, HTMLImageElement> = new Map([
        [Images.getImage(/rock\/rock_a/), Images.getImage(/rock_a_dead/)],
        [Images.getImage(/rock\/rock_b/), Images.getImage(/rock_b_dead/)],
        [Images.getImage(/rock\/rock_c_l/), Images.getImage(/rock_c_dead_l/)],
        [Images.getImage(/rock\/rock_c_r/), Images.getImage(/rock_c_dead_r/)]
    ]);

    public constructor(x: number, y: number, image?: HTMLImageElement) {
        if (image) {
            super([image], x, y, Obstacle.destroyMap);
        } else {
            super(Obstacle.images, x, y, Obstacle.destroyMap);
        }
        if (this.getImage() === Images.getImage(/rock\/rock_c_m/)) {
            //this.y += World.tileSize;
            //this.yOffset -= World.tileSize;
            this.xOffset = -World.tileSize;
            this.z = 40;
        } else if (this.getImage() === Images.getImage(/rock\/rock_c_r/)) {
            this.xOffset = -World.tileSize * 2;
        }
    }

    public isArchStart(): boolean {
        return this.getImage() === Images.getImage(/rock\/rock_c_l/);
    }

    public isArchMid(): boolean {
        return this.getImage() === Images.getImage(/rock\/rock_c_m/);
    }

    public isArchRight(): boolean {
        return this.getImage() === Images.getImage(/rock\/rock_c_r/);
    }

    public isSolid(): boolean {
        return !this.isDestroyed() && !(this.getImage() === Images.getImage(/rock\/rock_c_m/));
    }

    public isFlat(): boolean {
        return false;
    }

    public getDamageAmount(): number {
        return this.getImage() === Images.getImage(/rock\/rock_a/) ? .5 : 1;
    }
}
