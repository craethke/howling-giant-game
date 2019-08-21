export default class Drawable {

    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected x: number = 0;
    protected y: number = 0;

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
        this.ctx.drawImage(src, dx, Math.round(dy));
    }

    public renderText(text: string) {
        this.ctx.font = "30px Arial";
        this.ctx.fillText(text, 30, 30, 1000);
    }

    // TODO: Make this work
    public flipCanvas(): void {
        this.ctx.save();
        //this.ctx.transform(this.canvas.width, 0, 0, 0, 0, 0);
        this.ctx.scale(-1, 1);
        this.ctx.transform(- this.canvas.width, 0, 0, 0, 0, 0);
    }

    public restoreCanvas(): void {
        this.ctx.restore();
    }

    public getX() {
        return this.x;
    }

    public getY() {
        return this.y;
    }
}
