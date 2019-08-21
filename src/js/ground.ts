import WorldTile from './worldTile';
import { Images } from './assets';

export default class Ground extends WorldTile {

    private static images: HTMLImageElement[] = [
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundDefault,
        Images.groundRockA,
        Images.groundRockB,
        Images.groundRockA,
        Images.groundRockB,
        Images.tumbleweed,
        Images.cactusDead
    ];

    public constructor(x: number, y: number) {
        super(Ground.images, x, y);
    }
}
