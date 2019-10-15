import Game from "./game";
import { Images } from "./assets";

export default class Drawable {

    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected x: number = 0;
    protected y: number = 0;
    protected z: number = 0;

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.ctx = this.canvas.getContext("2d");
    }

    public update(): void {
        // Do nothing
    }

    public render(): void {
        throw new Error('render() is not implemented yet!');
    }

    public renderImage(src: CanvasImageSource, dx: number, dy: number): void {
        this.ctx.drawImage(
            src,
            dx - Game.getInstance().getCamera().getX(),
            Math.round(dy) - Game.getInstance().getCamera().getY());
    }

    public renderHudImage(src: CanvasImageSource, dx: number, dy: number): void {
        this.ctx.drawImage(src, dx, Math.round(dy));
    }

    public renderHudImagePartial(src: CanvasImageSource, dx: number, dy: number, w: number, h: number): void {
        this.ctx.drawImage(src, dx, dy, w, h);
    }

    public renderImageFlipped(src: HTMLImageElement, dx: number, dy: number): void {
        this.ctx.save();
        this.ctx.translate(dx + src.width - Game.getInstance().getCamera().getX(), 0);
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(src, 0, Math.round(dy - Game.getInstance().getCamera().getY()));
        this.ctx.restore();
    }

    public renderText(text: string, dx: number, dy: number) {
        let letterSize: number = 9;
        for (let i: number = 0; i < text.length; i++) {
            this.renderLetter(text.charAt(i).toLowerCase(), dx + i * letterSize, dy);
        }
    }

    public renderTextFlash(text: string, dx: number, dy: number, flashPos: number) {
        let letterSize: number = 9;
        let firstPart: string = text.substr(0, flashPos);
        let flashLetter: string = text.substr(flashPos, flashPos + 1);
        let lastPart: string = text.substr(flashPos + 1, text.length - 1);
        this.renderText(firstPart, dx, dy);
        if (Math.floor(new Date().getTime() / 500) % 2 === 0) {
            this.renderText(flashLetter, dx + firstPart.length * letterSize, dy);
        }
        this.renderText(lastPart, dx + (firstPart.length + 1) * letterSize, dy);
    }

    public renderLetter(letter: string, dx: number, dy: number) {
        let letters = /^[a-z0-9 -_.]$/;
        if (!letters.test(letter)) {
            throw new Error('Only 1 character alphanumeric string allowed, found ' + letter);
        }
        if (letter === 'e') {
            letter = 'e_endcap';
        }
        if (letter === '-') {
            letter = 'dash';
        }
        if (letter === '.') {
            letter = 'period';
            dx += 2;
            dy += 7;
        }
        if (letter === '_') {
            let image: HTMLImageElement = Images.getImage(new RegExp('smalltext_' + 'period'));
            this.renderHudImage(image, dx + 2, dy + 7);
            this.renderHudImage(image, dx + 6, dy + 7);
        } else if (letter !== ' ') {
            let image: HTMLImageElement = Images.getImage(new RegExp('smalltext_' + letter + '.png'));
            this.renderHudImage(image, dx, dy);
        }
    }

    public clearCanvas(color: string, opacity?: number): void {
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalAlpha = 1;
    }

    public getX() {
        return this.x;
    }

    public getY() {
        return this.y;
    }

    public getZ() {
        return this.z;
    }
}
