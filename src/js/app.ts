import '../css/main.css';
import path = require('path');
import Game from './game';

export default class App {

    public static refreshRate: number = 60; // Hz

    private game: Game;
    private nextRefresh: number;
    
    constructor(game: Game) {
        this.game = game;
    }

    public setup(): void {
        this.gameLoop();
        this.nextRefresh = this.getNextRefresh();
    }

    public gameLoop(): void {
        requestAnimationFrame(this.gameLoop.bind(this));

        if (this.shouldRefresh()) {
            this.game.render();
            this.nextRefresh = this.getNextRefresh();
        }
    }

    private getNextRefresh(): number {
        return new Date().getTime() + 1000 / App.refreshRate;
    }

    private shouldRefresh(): boolean {
        let currentTime: number = new Date().getTime();
        return currentTime > this.nextRefresh;
    }
}

window.onload = () => {
    let app = new App(Game.getInstance());

    app.setup();
}
