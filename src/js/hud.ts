import Drawable from "./drawable";
import Game from "./game";
import { Images } from "./assets";
import { runInThisContext } from "vm";

export default class Hud extends Drawable {

    private static heartMap: { [index: number] : HTMLImageElement } = {
        0: Images.hudHeartEmpty,
        1: Images.hudHeartHalf,
        2: Images.hudHeartFull
    }

    private game: Game;

    public constructor(game: Game) {
        super();
        this.game = game;
        this.x = 0;
        this.y = 0;
    }

    public renderHearts(): void {
        let healthHalfs = this.game.getTruck().getHealth() * 2;
        for (let i: number = 0; i < 3; i++) {
            let index: number = Math.max(0, Math.min(2, healthHalfs - i * 2))
            let drawX: number = this.x + 26 + i * 12;
            let drawY = this.y + 6;
            super.renderImage(Hud.heartMap[index], drawX, drawY);
        }
    }
    
    public render(): void {
        super.renderImage(Images.hudDefaultA, this.x + 2, this.y + 2);
        super.renderImage(Images.hudHeartbar, this.x + 26, this.y + 10);
        super.renderImage(Images.hudHeartFull, this.x + 26, this.y + 6);
        super.renderImage(Images.hudHeartFull, this.x + 38, this.y + 6);
        super.renderImage(Images.hudHeartFull, this.x + 50, this.y + 6);
        this.renderHearts();
    }
}
