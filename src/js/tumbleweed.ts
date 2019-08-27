import WorldTile from './worldTile';
import Animation from './animation';
import { Images } from './assets';
import Game from './game';
import World from './world';
import { runInThisContext } from 'vm';

export default class Tumbleweed extends WorldTile {

    private static pixelsPerFrame = 1;

    public constructor(x: number, y: number) {
        super(new Animation(/tumbleweed_r_anim/), x, y);
        this.z = 1;
    }

    public isSlow(): boolean {
        return true;
    }

    public update(): void {
        if (!Game.getInstance().getWorld().isPaused()) {
            this.x += Tumbleweed.pixelsPerFrame;
        }
    }
}
