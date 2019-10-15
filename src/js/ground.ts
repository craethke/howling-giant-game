import WorldTile from './worldTile';
import { Images } from './assets';

export default class Ground extends WorldTile {

    private static images: HTMLImageElement[] = []
        .concat(new Array(35).fill(Images.getImage(/bg_default/)))
        .concat(new Array(2).fill(Images.getImage(/bg_rock_a/)))
        .concat(new Array(2).fill(Images.getImage(/bg_rock_b/)))
        .concat(new Array(1).fill(Images.getImage(/cactus_dead/)));

    public constructor(x: number, y: number) {
        super(Ground.images, x, y);
    }
}
