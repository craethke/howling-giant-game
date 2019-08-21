import Drawable from './drawable';
import World from './world';
import Truck from './truck';
import Hud from './hud';

export default class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    
    private width: number = window.innerWidth;
    private height: number = window.innerHeight;

    private drawables: Drawable[] = [];

    private world: World;
    private truck: Truck;
    private hud: Hud;


    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvas.width = World.tileSize * World.tilesWide;
        this.canvas.height = World.tileSize * World.tilesHigh;
        this.ctx = this.canvas.getContext("2d");

        this.initializeState();
    }

    public render(): void {
        this.clearCanvas();
        this.drawables.forEach(drawable => drawable.update());

        this.world.render();
        let drawables: Drawable[] = this.world.getTiles();
        drawables.sort((a: Drawable, b: Drawable) => a.getY() - b.getY());
        for (let i: number = 0; i < drawables.length; i++) {
            
        }
        drawables.forEach(drawable => drawable.render());
        this.truck.render();
        this.hud.render();
    }

    public getWorld(): World {
        return this.world;
    }

    public getTruck(): Truck {
        return this.truck;
    }

    public getHud(): Hud {
        return this.hud;
    }

    private initializeState(): void {
        this.world = new World();
        this.truck = new Truck(this);
        this.hud = new Hud(this);
        this.drawables.push(this.world);
        this.drawables.push(this.truck);
        this.drawables.push(this.hud);
    }

    private clearCanvas(): void {
        this.ctx.fillStyle = '#c4cfa1'; // basic ground color
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
