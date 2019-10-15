import Animation from './animation';
import { Images, Sounds } from './assets';
import World from './world';
import Camera from './camera';
import Credits from './credits';
import HighScores from './highScores';
import EndingScene from './endingScene';
import Drawable from './drawable';
import Hud from './hud';
import TouchUtils from './touchUtils';
import Truck from './truck';
import ScoresRepository from './scoresRepository';
import Obstacle from './obstacle';
import WorldTile from './worldTile';


export default class Game extends Drawable {

    private static instance: Game;

    private width: number = window.innerWidth;
    private height: number = window.innerHeight;

    private drawables: Drawable[] = [];

    private world: World;
    private truck: Truck;
    private hud: Hud;
    private camera: Camera;
    private credits: Credits;
    private endingScene: EndingScene;
    private highScores: HighScores = new HighScores(new ScoresRepository());
    private state: State = State.NOT_STARTED;
    private playAgain: boolean = true;
    private notStartedAnimation: Animation;
    //private menuMusic: HTMLAudioElement = Sounds.getSound(/CometRiderStartMenuLoop/);
    private gameMusic: HTMLAudioElement = Sounds.getSound(/Comet Rider \(LeadOne 8 bit Cover\) Rev\.3/);
    private textFlashRate: number;
    private lastTextFlashTime: number;
    private logoAnimPause: number;
    private lastLogoAnimPause: number;
    private startTimer: number;
    private gameStartTime: number;
    private gameCurrentTime: number = 0;
    private gameCurrentScore: number = 0;
    private gameOverTime: number;
    private lastUpdateTime: number;
    private gameOverGraphicY: number;
    private initialized: boolean = false;
    private mode: Mode;

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
        this.mode = Mode.SURVIVE;

        this.initializeState();
    }

    public render(): void {
        if (!this.initialized) {
            return;
        }
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
            case State.PAUSED:
                this.renderPaused();
                break;

            case State.WON:
                this.renderWon();
                break;
            case State.ENDING_SCENE:
                this.renderEndingScene();
                break;
            case State.CREDITS:
                this.renderCredits();
                break;
            case State.HIGHSCORES:
                this.renderHighScores();
                break;
        }
        let now: number = new Date().getTime();
        if (this.state === State.STARTED || this.state === State.WON) {
            this.gameCurrentTime += now - this.lastUpdateTime;
        }
        this.lastUpdateTime = now;
    }

    private renderNotStarted() {
        this.renderWorld();
        //this.clearCanvas('#1f1f1f', .25);
        let currentTime: number = new Date().getTime();
        let bounceAmount = Math.sin(currentTime / 200) * 1;
        if (this.notStartedAnimation.isDone()) {
            super.renderHudImage(this.notStartedAnimation.getCurrentFrame(), 0, 10 + bounceAmount);
            if (currentTime > this.lastLogoAnimPause + this.logoAnimPause) {
                this.notStartedAnimation.restart();
            }
        } else {
            super.renderHudImage(this.notStartedAnimation.getNextFrame(), 0, 10 + bounceAmount);
            if (this.notStartedAnimation.isDone()) {
                this.lastLogoAnimPause = currentTime;
            }
        }

        let modeImage: HTMLImageElement = this.mode === Mode.SURVIVE
            ? Images.getImage(/gametext_start/)
            : Images.getImage(/gametext_score/);
        if (currentTime > this.lastTextFlashTime + this.textFlashRate / 2) {
            super.renderHudImage(modeImage, 50, 120);
            if (this.mode === Mode.SURVIVE) {
                super.renderHudImage(Images.getImage(/gametext_arrow_r/), 106, 124);
            } else {
                super.renderHudImage(Images.getImage(/gametext_arrow_l/), 49, 124);
            }
        }
        if (currentTime > this.lastTextFlashTime + this.textFlashRate) {
            this.lastTextFlashTime = currentTime;
        }
        if (this.startTimer > 0) {
            if (new Date().getTime() > this.startTimer) {
                this.startGame();
            }
        }
    }

    private renderStarted() {
        if (this.gameMusic.paused) {
            this.gameMusic.play();
        }

        this.gameCurrentScore = Math.floor(this.gameCurrentTime / 100);
        this.renderWorld();
        this.hud.render();
    }

    private renderWorld() {
        this.clearCanvas('#c4cfa1'); // basic ground color
        this.drawables.forEach(drawable => drawable.update());

        this.world.render();
        this.truck.renderDust();
        let drawables: Drawable[] = this.world.getTiles();
        drawables.push(this.truck);
        drawables.sort((a: Drawable, b: Drawable) => {
            if (Math.abs(a.getZ() - b.getZ()) > 10) {
                return a.getZ() - b.getZ();
            }
            let layerDiff = a.getY() - b.getY();
            if (Math.abs(layerDiff) > 1) {
                return layerDiff;
            }
            return a.getZ() - b.getZ();
        });
        drawables.forEach(drawable => {
            if (drawable instanceof WorldTile) {
                if (!(<WorldTile>drawable).isFlat()) {
                    drawable.render();
                }
            } else {
                drawable.render();
            }
        });
    }

    private renderGameOver() {
        this.renderWorld();
        //this.clearCanvas('#1f1f1f');
        let timeSinceGameOver = new Date().getTime() - this.gameOverTime;
        if (timeSinceGameOver > 1000) {
            this.ctx.fillStyle = '#1f1f1f';
            this.ctx.fillRect(0, this.gameOverGraphicY, World.tileSize * World.tilesWide, World.tileSize * World.tilesHigh);
            if (this.gameOverGraphicY < 0) {
                this.gameOverGraphicY += (-this.gameOverGraphicY) / 10 + 1;
            }
            super.renderHudImage(Images.getImage(/gameover_truck/), 0, 11 + this.gameOverGraphicY);
            super.renderHudImage(Images.getImage(/gametext_gameover/), 32, 80 + this.gameOverGraphicY);
            let currentTime = new Date().getTime();
            if (currentTime > this.lastTextFlashTime + this.textFlashRate / 2) {
                super.renderHudImage(Images.getImage(/gametext_continue.png/), 32, 105 + this.gameOverGraphicY);
            }
            if (currentTime > this.lastTextFlashTime + this.textFlashRate) {
                this.lastTextFlashTime = currentTime;
            }
            super.renderHudImage(Images.getImage(/gametext_yes/), 40, 119 + this.gameOverGraphicY);
            super.renderHudImage(Images.getImage(/gametext_no/), 93, 119 + this.gameOverGraphicY);
            if (this.playAgain) {
                super.renderHudImage(Images.getImage(/gametext_bracket_yes/), 26, 119 + this.gameOverGraphicY);
            } else {
                super.renderHudImage(Images.getImage(/gametext_bracket_no/), 88, 119 + this.gameOverGraphicY);
            }
        }
    }

    private renderWon() {
        this.renderWorld();
    }

    private renderEndingScene() {
        this.endingScene.render();
    }

    private renderCredits() {
        this.credits.update();
        this.credits.render();
        if (this.credits.isDone()) {
            this.gameMusic.pause();
            this.initializeState();
        }
    }

    private renderPaused() {
        if (!this.gameMusic.paused) {
            this.gameMusic.pause();
        }
        this.renderWorld();
        super.renderHudImage(Images.getImage(/gametext_pause/), 58, 70);
    }

    private renderHighScores() {
        this.highScores.update();
        this.highScores.render();
    }

    public getWorld(): World {
        return this.world;
    }

    public getTruck(): Truck {
        return this.truck;
    }

    public getCamera(): Camera {
        return this.camera;
    }

    public getHud(): Hud {
        return this.hud;
    }

    public getMode(): Mode {
        return this.mode;
    }

    public isStarted(): boolean {
        return this.state === State.STARTED;
    }

    public isGameOver(): boolean {
        return this.state === State.OVER;
    }

    public isHighScore(): boolean {
        return this.state === State.HIGHSCORES;
    }

    public isWon(): boolean {
        return this.state === State.WON;
    }

    public gameOver(): void {
        this.gameMusic.pause();

        this.gameOverGraphicY = -World.tileSize * World.tilesHigh;
        this.textFlashRate = 1000;
        this.gameOverTime = new Date().getTime();
        this.state = State.OVER;
    }

    public win(): void {
        this.state = State.WON;
    }

    public startEndingScene(): void {
        this.endingScene = new EndingScene();
        this.state = State.ENDING_SCENE;
    }

    public showCredits(): void {
        this.credits = new Credits();
        this.state = State.CREDITS;
    }

    public highScore(): void {
        this.highScores.initialize();
        this.state = State.HIGHSCORES;
        if (this.playAgain && !this.highScores.isEnteringHighScore()) {
            this.closeHighScores();
        }
    }

    public closeHighScores(): void {
        if (this.playAgain) {
            this.initializeGame();
            this.startGame();
        } else {
            this.showCredits();
        }
    }

    public alwaysShowHighScores(): boolean {
        return !this.playAgain;
    }

    private togglePause(): void {
        if (this.state === State.PAUSED) {
            this.getWorld().unpause();
            this.state = State.STARTED;
        } else {
            this.state = State.PAUSED;
            this.getWorld().pause();
        }
    }

    // Deprecated
    public getGameStartTime(): number {
        return this.gameStartTime;
    }

    public getCurrentTime(): number {
        return this.gameCurrentTime;
    }

    public getCurrentScore(): number {
        return this.gameCurrentScore;
    }

    public addScore(score: number): void {
        if (this.mode === Mode.SCORE) {
            this.gameCurrentTime += score * 1000;
        }
    }

    public initializeState(): void {
        this.state = State.NOT_STARTED;
        this.gameStartTime = Number.MAX_VALUE;
        this.notStartedAnimation = new Animation(/hg_logo_flash/);
        this.textFlashRate = 1000;
        this.lastTextFlashTime = new Date().getTime();
        this.logoAnimPause = 1000;
        this.lastLogoAnimPause = -1;
        this.playAgain = true;
        this.startTimer = -1;
        this.gameCurrentTime = 0;
        //this.menuMusic.currentTime = 0;
        //this.menuMusic.loop = true;
        //this.menuMusic.play().catch(e => console.log('Error playing sound: ' + e));
        this.camera = new Camera();
        this.initializeGame();
        this.initialized = true;

        //this.highScore();
    }

    private initializeGame(): void {
        this.world = new World();
        this.truck = new Truck();
        this.drawables = [];
        this.drawables.push(this.world);
        this.drawables.push(this.truck);
    }

    private startGame(): void {
        this.hud = new Hud();
        this.drawables.push(this.hud);
        this.state = State.STARTED;
        //this.menuMusic.pause();
        this.gameMusic.currentTime = 0;
        if (this.mode === Mode.SURVIVE) {
            this.gameMusic.loop = false;
        } else if (this.mode === Mode.SCORE) {
            this.gameMusic.loop = true;
        }
        this.gameMusic.play();
        this.gameStartTime = new Date().getTime();
        this.gameCurrentTime = 0;
    }

    private triggerStart(): void {
        this.textFlashRate = 250;
        this.startTimer = new Date().getTime() + 750;
    }

    private handleKeyboardEvent(e: KeyboardEvent): void {
        switch (this.state) {
            case State.NOT_STARTED:
                switch (e.key) {
                    case 'Enter':
                    case ' ':
                        this.triggerStart();
                        break;
                    case 'ArrowLeft':
                    case 'a':
                        this.mode = Mode.SURVIVE;
                        break;
                    case 'ArrowRight':
                    case 'd':
                        this.mode = Mode.SCORE;
                        break;
                }
                e.preventDefault();
                break;
            case State.STARTED:
            case State.PAUSED:
                switch (e.key) {
                    case 'Enter':
                    case ' ':
                        this.togglePause();
                        break;
                }
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
                        if (this.mode === Mode.SCORE) {
                            this.highScore();
                        } else {
                            if (this.playAgain) {
                                this.initializeGame();
                                this.startGame();
                            } else {
                                this.initializeState();
                            }
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
                this.triggerStart();
                break;
            case State.OVER:
                let touchX: number = TouchUtils.getTouchX(e);
                let touchY: number = TouchUtils.getTouchY(e);
                if (touchX > 26 && touchY > 119 && touchX < 26 + 60 && touchY < 119 + 16) {
                    // yes
                    this.playAgain = true;
                    this.initializeGame();
                    this.startGame();
                } else if (touchX > 40 && touchY > 119 && touchX < 88 + 40 && touchY < 119 + 16) {
                    this.playAgain = false;
                    this.initializeState();
                }
                break;
        }
    }
}

enum State {
    NOT_STARTED, STARTED, WON, ENDING_SCENE, CREDITS, PAUSED, OVER, HIGHSCORES
}

export enum Mode {
    SURVIVE, SCORE
}
