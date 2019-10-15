import { Images } from './assets';
import World from './world';
import UIBackground from './uiBackground';

export default class Credits extends UIBackground {

    private static creditsDelay: number = 4000;
    private static credits: HTMLImageElement[] = [
        Images.getImage(/credits_art_design/),
        Images.getImage(/credits_programming/),
        Images.getImage(/credits_special_thanks/)
    ];

    private creditsStartTime: number = new Date().getTime();
    private currentCredit: number = 0;

    public update(): void {
        super.update();
        if (new Date().getTime() > this.creditsStartTime + Credits.creditsDelay * (this.currentCredit + 1)
            && this.currentCredit < Credits.credits.length - 1) {
            this.currentCredit++;
        }
    }

    public render(): void {
        super.render();
        this.renderImage(Images.getImage(/credits_credits/), 0, 0);
        let creditImage = Credits.credits[this.currentCredit];
        this.renderImage(creditImage, 0, World.tileSize * World.tilesHigh / 2 - creditImage.height / 2);
    }

    public isDone(): boolean {
        return new Date().getTime() > this.creditsStartTime + (Credits.creditsDelay * (this.currentCredit + 1));
    }
}
