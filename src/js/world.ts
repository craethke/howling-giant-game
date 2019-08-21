import App from './app';
import Drawable from './drawable';
import WorldTile from './worldTile';
import Ground from './ground';
import Obstacle from './obstacle';
import Cactus from './cactus';
import { Images } from './assets';
import { createSecureServer } from 'http2';

export default class World extends Drawable {
    public static tileSize: number = 16;
    public static tilesWide: number = 10;
    public static tilesHigh: number = 10;

    private scrollSpeedPixelsPerFrame = 1;
    private grid: WorldTile[][] = [];

    constructor() {
        super();
        for (let i: number = 0; i < World.tilesHigh + 2; i++) {
            let newLine = this.generateLine(false);
            newLine.forEach(o => o.setY(World.tileSize * World.tilesHigh - i * World.tileSize));
            this.grid.push(newLine);
        }
    }

    public update(): void {
        this.scroll(this.scrollSpeedPixelsPerFrame);
        if (this.grid[0][0].getY() >= World.tileSize * (World.tilesHigh + 1)) {
            this.grid.shift();
            this.grid.push(this.generateLine(true));
        }
    }

    public render(): void {
        this.grid.forEach(r => r.forEach(o => super.renderImage(Images.groundDefault, o.getX(), o.getY())));
    }

    public getTiles(): WorldTile[] {
        return this.grid.reduce((acc, val) => acc.concat(val), []);
    }

    private generateLine(generateObstacles: boolean): WorldTile[] {
        let obstaclePosition: number = Math.floor(Math.random() * World.tilesWide)
        let isHealth: boolean = Math.floor(Math.random() * 5) === 1;
        let newLine = [];
        for (let i: number = 0; i < World.tilesWide; i++) {
            let x: number = i * World.tileSize;
            let lastLineY: number = this.grid.length > 0 ? this.grid[this.grid.length - 1][0].getY() : 0;
            let y: number = lastLineY - World.tileSize;
            if (i == obstaclePosition && generateObstacles) {
                if (isHealth) {
                    newLine.push(new Cactus(x, y));
                } else {
                    newLine.push(new Obstacle(x, y));
                }
            } else {
                newLine.push(new Ground(x, y));
            }
        }
        return newLine;
    }

    private scroll(pixels: number): void {
        this.grid.forEach(r => r.forEach(o => o.setY(o.getY() + pixels)));
    }
}
