import Animation from './animation';
import { Images } from './assets';
import Cloud from './cloud';
import Drawable from './drawable';
import World from './world';

export default class UIBackground extends Drawable {

    private truckAnim: Animation = new Animation(/credits_truck_anim/);
    private clouds: Cloud[] = this.spawnClouds();
    private horizonX: number = 0;

    public update(): void {
        this.clouds.forEach(c => {
            c.setX(c.getX() - .5);
            if (c.getX() < - World.tileSize * 2) {
                c.setX(World.tileSize * World.tilesWide);
            }
        });
        this.horizonX -= 1;
        if (this.horizonX <= -World.tileSize * World.tilesWide) {
            this.horizonX = 0;
        }
    }

    public render(): void {
        this.clearCanvas('#8b956d');
        this.clouds.forEach(c => c.render());
        this.renderImage(Images.getImage(/credits_horizon/), this.horizonX, World.tileSize);
        this.renderImage(Images.getImage(/credits_horizon/), this.horizonX + World.tileSize * World.tilesWide, World.tileSize);
        this.renderImage(this.truckAnim.getNextFrame(), 0, World.tileSize);
    }

    private spawnClouds(): Cloud[] {
        let clouds: Cloud[] = [];
        for (let i: number = 0; i < 10; i++) {
            let x = Math.random() * World.tileSize * World.tilesWide * 2;
            let y = Math.random() * World.tileSize * World.tilesHigh / 2 + World.tileSize;
            let cloud = new Cloud(x, y);
            clouds.push(cloud);
        }
        return clouds;
    }
}
