import Drawable from './drawable';
import World from './world';
import Truck from './truck';
import Hud from './hud';
import Animation from './animation';
import { Images } from './assets';
import TouchUtils from './touchUtils';

export default class Game extends Drawable {

    private static instance: Game;

    private width: number = window.innerWidth;
    private height: number = window.innerHeight;

    private drawables: Drawable[] = [];

    private world: World;
    private truck: Truck;
    private hud: Hud;
    private state: State = State.NOT_STARTED;
    private playAgain: boolean = true;
    private notStartedAnimation: Animation;
    private startFlashRate: number;
    private lastStartFlashTime: number;

    public static getInstance() {
        if (!this.instance) {
            this.instance = new Game();
        }
        return this.instance;
    }

    private constructor() {
        super();
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvas.width = World.tileSize * World.tilesWide;
        this.canvas.height = World.tileSize * World.tilesHigh;
        this.ctx = this.canvas.getContext("2d");
        window.addEventListener('keydown', this.handleKeyboardEvent.bind(this));
        this.canvas.addEventListener('touchstart', this.handleTouchEvent.bind(this));

        this.initializeState();
    }

    public render(): void {
        switch (this.state) {
            case State.NOT_STARTED:
                this.renderNotStarted();
                break;
            case State.STARTED:
                this.renderStarted();
                break;
            case State.OVER:
                this.renderGameOver();
                break;
        }
    }
    
    private renderStarted() {
        this.clearCanvas('#c4cfa1'); // basic ground color
        this.drawables.forEach(drawable => drawable.update());

        this.world.render();
        let drawables: Drawable[] = this.world.getTiles();
        drawables.push(this.truck);
        drawables.sort((a: Drawable, b: Drawable) => {
            let layerDiff = a.getY() - b.getY();
            if (Math.abs(layerDiff) > 1) {
                return layerDiff;
            }
            return a.getZ() - b.getZ();
        });
        for (let i: number = 0; i < drawables.length; i++) {
            
        }
        drawables.forEach(drawable => drawable.render());
        this.truck.renderDust();
        this.hud.render();
    }

    private renderNotStarted() {
        this.clearCanvas('#1f1f1f');
        super.renderImage(this.notStartedAnimation.getNextFrame(), 0, 10);
        let currentTime: number = new Date().getTime();
        if (currentTime > this.lastStartFlashTime + this.startFlashRate / 2) {
            super.renderImage(Images.getImage(/gametext_start/), 50, 120);
        }
        if (currentTime > this.lastStartFlashTime + this.startFlashRate) {
            this.lastStartFlashTime = currentTime;
        }
    }

    private renderGameOver() {
        this.clearCanvas('#1f1f1f');
        super.renderImage(Images.getImage(/gameover_truck/), 0, 11);
        super.renderImage(Images.getImage(/gametext_gameover/), 32, 80);
        super.renderImage(Images.getImage(/gametext_continue.png/), 32, 105);
        super.renderImage(Images.getImage(/gametext_yes/), 40, 119);
        super.renderImage(Images.getImage(/gametext_no/), 93, 119);
        if (this.playAgain) {
            super.renderImage(Images.getImage(/gametext_bracket_yes/), 26, 119);
        } else {
            super.renderImage(Images.getImage(/gametext_bracket_no/), 88, 119);
        }
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

    public isStarted(): boolean {
        return this.state === State.STARTED;
    }

    public isGameOver(): boolean {
        return this.state === State.OVER;
    }

    public gameOver(): void {
        this.state = State.OVER;
    }

    private initializeState(): void {
        this.state = State.NOT_STARTED; 
        this.notStartedAnimation = new Animation(/hg_logo_flash/);
        this.startFlashRate = 1000;
        this.lastStartFlashTime = new Date().getTime();
        this.playAgain = true;
    }

    private startGame(): void {
        this.state = State.STARTED;
        this.world = new World();
        this.truck = new Truck();
        this.hud = new Hud();
        this.drawables = [];
        this.drawables.push(this.world);
        this.drawables.push(this.truck);
        this.drawables.push(this.hud);
    }

    private handleKeyboardEvent(e: KeyboardEvent): void {
        switch (this.state) {
            case State.NOT_STARTED:
                switch (e.key) {
                    case 'Enter':
                    case ' ':
                        this.startGame();
                        break;
                }
                e.preventDefault();
                break;
            case State.OVER:
                switch (e.key) {
                    case 'a':
                    case 'ArrowLeft':
                    case 'd':
                    case 'ArrowRight':
                        this.playAgain = !this.playAgain;
                        break;
                    case 'Enter':
                    case ' ':
                        if (this.playAgain) {
                            this.startGame();
                        } else {
                            this.initializeState();
                        }
                        break;
                }
                e.preventDefault();
            break;
        }
    }

    private handleTouchEvent(e: TouchEvent) {
        switch (this.state) {
            case State.NOT_STARTED:
                this.startGame();
                break;
            case State.OVER:
                let touchX: number = TouchUtils.getTouchX(e);
                let touchY: number = TouchUtils.getTouchY(e);
                if (touchX > 26 && touchY > 119 && touchX < 26 + 60 && touchY < 119 + 16) {
                    // yes
                    this.playAgain = true;
                    this.startGame();
                } else if (touchX > 40 && touchY > 119 && touchX < 88 + 40 && touchY < 119 + 16) {
                    this.playAgain = false;
                    this.initializeState();
                }
                break;
        }
    }

    private clearCanvas(color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

enum State {
    NOT_STARTED, STARTED, OVER
}
