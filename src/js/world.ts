import App from './app';
import Drawable from './drawable';
import WorldTile from './worldTile';
import Ground from './ground';
import Obstacle from './obstacle';
import Cactus from './cactus';
import Tumbleweed from './tumbleweed';
import { Images } from './assets';

export default class World extends Drawable {

    private static slowTime: number = 1000;

    public static tileSize: number = 16;
    public static tilesWide: number = 10;
    public static tilesHigh: number = 10;

    private normalScrollSpeed: number = 3;
    private slowScrollSpeed: number = 1;
    private grid: WorldTile[][] = [];
    private tumbleweeds: WorldTile[] = [];
    private state: State = State.NORMAL;
    private stateStart: number = new Date().getTime();

    constructor() {
        super();
        for (let i: number = 0; i < World.tilesHigh + 2; i++) {
            let newLine = this.generateLine(false);
            newLine.forEach(o => o.setY(World.tileSize * World.tilesHigh - i * World.tileSize));
            this.grid.push(newLine);
        }
    }

    public update(): void {
        this.updateState();
        if (this.state === State.NORMAL) {
            this.scroll(this.normalScrollSpeed);
        } else if (this.state === State.SLOW) {
            this.scroll(this.slowScrollSpeed);
        }
        if (this.grid[0][0].getY() >= World.tileSize * (World.tilesHigh + 1)) {
            this.grid.shift();
            this.grid.push(this.generateLine(true));
            this.generateTumbleweeds();
        }
        this.updateTumbleweeds();
    }

    public render(): void {
        this.grid.forEach(r => r.forEach(o => super.renderImage(Images.groundDefault, o.getX(), o.getY())));
    }

    public getTiles(): WorldTile[] {
        return this.grid.reduce((acc, val) => acc.concat(val), []).concat(this.tumbleweeds);
    }

    public slow(): void {
        this.state = State.SLOW;
        this.stateStart = new Date().getTime();
    }

    public pause(): void {
        this.state = State.PAUSED;
    }

    public isPaused(): boolean {
        return this.state === State.PAUSED;
    }

    private updateState(): void {
        if (this.state === State.SLOW && new Date().getTime() > this.stateStart + World.slowTime) {
            this.state = State.NORMAL;
        }
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

    private generateTumbleweeds(): void {
        let generateTumbleweed: boolean = Math.floor(Math.random() * 5) === 1;
        if (generateTumbleweed) {
            let newY = Math.floor(Math.random() * World.tilesHigh * 2) * World.tileSize - World.tileSize * World.tilesHigh;
            let newX = -World.tileSize;
            this.tumbleweeds.push(new Tumbleweed(newX, newY));
        }
    }

    private updateTumbleweeds(): void {
        this.tumbleweeds.forEach(t => t.update());
        this.tumbleweeds = this.tumbleweeds.filter(t => t.getX() < World.tileSize * (World.tilesWide + 1));
    }

    private scroll(pixels: number): void {
        this.grid.forEach(r => r.forEach(o => o.setY(o.getY() + pixels)));
        this.tumbleweeds.forEach(t => t.setY(t.getY() + pixels));
    }
}

enum State {
    NORMAL, SLOW, PAUSED
}
