import { Images } from './assets';

export default class Animation {

    private animationFrame: number = 0;
    private images: HTMLImageElement[];
    private started: boolean = false;

    public constructor(regex: RegExp) {
        this.images = Images.getImages(regex);
    }

    public getCurrentFrame(): HTMLImageElement {
        return this.images[this.animationFrame];
    }

    public getNextFrame(): HTMLImageElement {
        let currentFrame: HTMLImageElement = this.images[this.animationFrame];
        this.animationFrame = (this.animationFrame + 1) % this.images.length;
        this.started = true;
        return currentFrame;
    }

    public isDone() {
        return this.animationFrame === 0 && this.started;
    }

    public restart() {
        this.started = false;
        this.animationFrame = 0;
    }
}
