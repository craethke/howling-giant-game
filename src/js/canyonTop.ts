import WorldTile from './worldTile';
import { Images } from './assets';
import Game from './game';

export default class CanyonTop extends WorldTile {

    private actualImage: HTMLImageElement;

    public constructor(imagesOrAnimation: any, x: number, y: number) {

        super([Images.getImage(/bg_dark/)], x, y);
        this.actualImage = imagesOrAnimation[0];
        this.z = 1;
    }

    public render(): void {
        //super.render();
        super.renderImage(this.actualImage, this.x, this.y + this.yOffset);
        if (!Game.getInstance().getWorld().isPaused()
            && Game.getInstance().getWorld().getFramesSinceCanyonSpawnTime() <= 35) {
            this.yOffset -= 1;
        }
    }

    public isFlat(): boolean {
        return false;
    }
}
