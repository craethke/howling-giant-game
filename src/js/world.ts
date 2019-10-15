import { Images } from './assets';
import WorldTile from './worldTile';
import Bandit from './bandit';
import Cactus from './cactus';
import CanyonBottom from './canyonBottom';
import CanyonTop from './canyonTop';
import Drawable from './drawable';
import Game, { Mode } from './game';
import Ground from './ground';
import Obstacle from './obstacle';
import Tumbleweed from './tumbleweed';

export default class World extends Drawable {

    private static slowTime: number = 1000;
    private static obstacleStartTime: number = 3000;
    public static gameWinTime: number = 236000; // 260000; // 4 min 20 sec
    private static gameWinCanyonSpawnTime: number = World.gameWinTime + 3000;
    private static gameWinStopSpawnTime: number = World.gameWinTime - 2250;
    public static gameWinCameraStopTime: number = World.gameWinTime + 4500;
    private static gameWinEndingSceneTime: number = World.gameWinTime + 8000;

    public static tileSize: number = 16;
    public static tilesWide: number = 10;
    public static tilesHigh: number = 10;

    private normalScrollSpeed: number = 3;
    private slowScrollSpeed: number = 1;
    private grid: WorldTile[][] = [];
    private tumbleweeds: WorldTile[] = [];
    private bandits: WorldTile[] = [];
    private state: State = State.NORMAL;
    private prePauseState: State = State.NORMAL;
    private stateStart: number = 0;
    private canyonSpawned: boolean = false;
    private framesSinceCanyonSpawn: number = 0;

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
        let currentTime = Game.getInstance().getCurrentTime();
        if (Game.getInstance().isStarted()) {
            if (Game.getInstance().getMode() === Mode.SURVIVE && currentTime > World.gameWinTime) {
                Game.getInstance().win();
            }
        }
        if (Game.getInstance().getMode() === Mode.SURVIVE && currentTime > World.gameWinCanyonSpawnTime && !this.canyonSpawned) {
            this.generateCanyon();
            this.canyonSpawned = true;
        }
        if (this.canyonSpawned) {
            this.framesSinceCanyonSpawn++;
        }
        let generateObstacles: boolean = Game.getInstance().isStarted()
            && Game.getInstance().getCurrentTime() > World.obstacleStartTime
            && (Game.getInstance().getMode() === Mode.SCORE || Game.getInstance().getCurrentTime() < World.gameWinStopSpawnTime);
        if (this.grid[0][0].getY() >= World.tileSize * (World.tilesHigh + 1)) {
            this.grid.shift();
            this.grid.push(this.generateLine(generateObstacles));
            if (generateObstacles) {
                this.generateTumbleweeds();
                this.generateBandits();
            }
        }
        this.updateTumbleweeds();
        this.updateBandits();

        if (Game.getInstance().getMode() === Mode.SURVIVE && currentTime > World.gameWinEndingSceneTime) {
            Game.getInstance().startEndingScene();
        }
    }

    public render(): void {
        this.grid.forEach(r => r.forEach(o => {
            super.renderImage(Images.getImage(/bg_default/), o.getX(), o.getY());
            if (o instanceof Obstacle) {
                if ((<Obstacle>o).isArchStart()) {
                    super.renderImage(Images.getImage(/bg_rock_c_l/), o.getX(), o.getY());
                } else if ((<Obstacle>o).isArchMid()) {
                    super.renderImage(Images.getImage(/bg_rock_c_m/), o.getX(), o.getY());
                } else if ((<Obstacle>o).isArchRight()) {
                    super.renderImage(Images.getImage(/bg_rock_c_r/), o.getX(), o.getY());
                }
            }
            if (o.isFlat()) {
                o.render();
            }
        }));
        this.grid.forEach(r => r.forEach(o => {
            if (o instanceof CanyonTop) {
                super.renderImage(Images.getImage(/bg_dark/), o.getX(), o.getY());
            }
        }));
    }

    public getTiles(): WorldTile[] {
        return this.grid.reduce((acc, val) => acc.concat(val), []).concat(this.tumbleweeds).concat(this.bandits);
    }

    public slow(): void {
        this.state = State.SLOW;
        this.stateStart = Game.getInstance().getCurrentTime();
    }

    public pause(): void {
        this.prePauseState = this.state;
        this.state = State.PAUSED;
    }

    public unpause(): void {
        this.state = this.prePauseState;
    }

    public isPaused(): boolean {
        return this.state === State.PAUSED;
    }

    public getSpeed(): number {
        if (this.state === State.NORMAL) {
            return this.normalScrollSpeed;
        } else if (this.state === State.SLOW) {
            return this.slowScrollSpeed;
        } else {
            return 0;
        }
    }

    public getFramesSinceCanyonSpawnTime(): number {
        return this.framesSinceCanyonSpawn;
    }

    private updateState(): void {
        if (this.state === State.SLOW && Game.getInstance().getCurrentTime() > this.stateStart + World.slowTime) {
            this.state = State.NORMAL;
        }
    }

    private generateLine(generateObstacles: boolean): WorldTile[] {
        let obstaclePosition: number = Math.floor(Math.random() * World.tilesWide)
        let isHealth: boolean = Math.floor(Math.random() * 5) === 1;
        let newLine = [];
        let nextObstacleImage = null;
        for (let i: number = 0; i < World.tilesWide; i++) {
            let x: number = i * World.tileSize;
            let y: number = this.getNewLineY();
            if (i == obstaclePosition && generateObstacles) {
                if (isHealth) {
                    newLine.push(new Cactus(x, y));
                } else {
                    let obstacle = new Obstacle(x, y);
                    if (obstacle.isArchStart()) {
                        nextObstacleImage = Images.getImage(/rock\/rock_c_m/);
                    }
                    newLine.push(obstacle);
                }
            } else {
                if (nextObstacleImage !== null) {
                    let obstacle = new Obstacle(x, y, nextObstacleImage);
                    newLine.push(obstacle);
                    if (obstacle.isArchMid()) {
                        nextObstacleImage = Images.getImage(/rock\/rock_c_r/);
                    } else {
                        nextObstacleImage = null;
                    }
                } else {
                    if (this.canyonSpawned) {
                        newLine.push(new CanyonTop([Images.getImage(/bg_default/)], x, y));
                    } else {
                        newLine.push(new Ground(x, y));
                    }
                }
            }
        }
        return newLine;
    }

    private generateCanyon() {
        let canyonEdgeNearA = Images.getImage(/bg_canyonedge_near_a/);
        let canyonEdgeNearB = Images.getImage(/bg_canyonedge_near_b/);
        let canyonBottom = Images.getImage(/bg_dark/);
        let canyonWallBottom = Images.getImage(/bg_canyonwall_bottom/);
        let canyonWall = Images.getImage(/bg_canyonwall/);
        let canyonEdgeFarA = Images.getImage(/bg_canyonedge_far_a/);
        let canyonEdgeFarB = Images.getImage(/bg_canyonedge_far_b/);

        let firstRow: WorldTile[] = [];
        for (let i: number = 0; i < 5; i++) {
            let x: number = i * World.tileSize * 2;
            let y: number = this.getNewLineY();
            firstRow.push(new WorldTile([canyonEdgeNearA], x, y));
            x = i * World.tileSize * 2 + World.tileSize;
            firstRow.push(new WorldTile([canyonEdgeNearB], x, y));
        }
        this.grid.push(firstRow);

        this.pushCanyonRows(canyonBottom, 0, WorldTile);
        this.pushCanyonRows(canyonWallBottom, 1, CanyonTop);
        this.pushCanyonRows(canyonWall, 1, CanyonTop);
        this.pushCanyonRows(canyonWall, 1, CanyonBottom);

        let lastRow: WorldTile[] = [];
        for (let i: number = 0; i < 5; i++) {
            let x: number = i * World.tileSize * 2;
            let y: number = this.getNewLineY();
            lastRow.push(new CanyonTop([canyonEdgeFarA], x, y));
            x = i * World.tileSize * 2 + World.tileSize;
            lastRow.push(new CanyonTop([canyonEdgeFarB], x, y));
        }
        this.grid.push(lastRow);

    }

    private pushCanyonRows<T extends WorldTile>(
        image: HTMLImageElement, n: number,
        type: { new(imagesOrAnimation: any, x: number, y: number): T; }): void {
        for (let r: number = 0; r < n; r++) {
            let row: WorldTile[] = [];
            for (let i: number = 0; i < 10; i++) {
                let x: number = i * World.tileSize;
                let y: number = this.getNewLineY();
                row.push(new type([image], x, y));
            }
            this.grid.push(row);
        }
    }

    private getNewLineY(): number {
        let lastLineY: number = this.grid.length > 0 ? this.grid[this.grid.length - 1][0].getY() : 0;
        return lastLineY - World.tileSize;
    }

    private generateTumbleweeds(): void {
        let generateTumbleweed: boolean = Math.floor(Math.random() * 10) === 1;
        if (generateTumbleweed) {
            let lastGridY = this.grid[this.grid.length - 1][0].getY();
            let newY = Math.floor(Math.random() * World.tilesHigh * 2) * World.tileSize - World.tileSize * World.tilesHigh + lastGridY;
            let newX = -World.tileSize;
            this.tumbleweeds.push(new Tumbleweed(newX, newY));
        }
    }

    private updateTumbleweeds(): void {
        this.tumbleweeds.forEach(t => t.update());
        this.tumbleweeds = this.tumbleweeds.filter(t => t.getX() < World.tileSize * (World.tilesWide + 1));
    }

    private generateBandits(): void {
        let generateBandit: boolean = Math.floor(Math.random() * 20) === 1;
        if (generateBandit) {
            let newX = Math.floor(Math.random() * World.tilesWide) * World.tileSize;
            let newY = World.tilesHigh * World.tileSize + World.tileSize;
            this.bandits.push(new Bandit(newX, newY));
        }
    }

    private updateBandits(): void {
        this.bandits.forEach(b => b.update());
        this.bandits = this.bandits
            .filter(b => b.getY() > -World.tileSize && b.getY() < World.tileSize * World.tilesHigh + World.tileSize);
    }

    private scroll(pixels: number): void {
        if (Game.getInstance().isWon()
            && this.framesSinceCanyonSpawn > 45) {
            Game.getInstance().getTruck().setY(Game.getInstance().getTruck().getY() - pixels);
        } else {
            this.grid.forEach(r => r.forEach(o => {
                if (o instanceof CanyonTop) {
                    o.setY(o.getY() + pixels);
                } else {
                    o.setY(o.getY() + pixels);
                }
            }));
        }
        this.tumbleweeds.forEach(t => t.setY(t.getY() + pixels));
    }
}

enum State {
    NORMAL, SLOW, PAUSED
}
