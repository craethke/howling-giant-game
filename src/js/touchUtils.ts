import World from './world';

export default class TouchUtils {
    
    public static getTouchX(e: TouchEvent): number {
        return e.touches[0].clientX / TouchUtils.computeScale();
    }

    public static getTouchY(e: TouchEvent): number {
        return e.touches[0].clientY / TouchUtils.computeScale();
    }

    private static computeScale(): number {
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
        let canvasWidth: number = parseInt(getComputedStyle(canvas).width);
        return canvasWidth / (World.tileSize * World.tilesWide);
    }
}
