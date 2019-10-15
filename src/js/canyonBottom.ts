import WorldTile from './worldTile';
import BoundingBox from './boundingBox';
import World from './world';
import CanyonTop from './canyonTop';

export default class CanyonBottom extends CanyonTop {

    public constructor(imagesOrAnimation: any, x: number, y: number) {
        super(imagesOrAnimation, x, y);
    }

    public isCanyonBottom(): boolean {
        return true;
    }

    public isFlat(): boolean {
        return false;
    }

    public getBoundingBox(): BoundingBox {
        return new BoundingBox(this.x, this.y, this.tilesWide * World.tileSize, this.tilesHigh * World.tileSize / 2);
    }
}
