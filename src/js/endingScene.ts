import Drawable from './drawable';
import Animation from './animation';
import Game from './game';
import { Images } from './assets';
import World from './world';

export default class EndingScene extends Drawable {

    private static BANDIT_ARRIVE_TIME: number = 1000;
    private static HAND_MOVE_TIME: number = 5000;
    private static SLAM_TIME: number = 7000;
    private static YOU_WIN_TEXT_TIME: number = 8000;
    private static END_SCENE_TIME: number = 12000; // 8000
    private static HAND_INITIAL_Y: number = 256 + World.tileSize;

    private time: number = 0;
    private lastUpdate: number = new Date().getTime();

    private handY: number = EndingScene.HAND_INITIAL_Y;
    private slammed: boolean = false;

    private banditInitialYs: number[] = [123 + World.tileSize * 5, 118 + World.tileSize * 4, 120 + World.tileSize * 6];
    private banditFinalYs: number[] = [123 + World.tileSize, 118 + World.tileSize, 120 + World.tileSize];
    private banditXs: number[] = [28, 74, 125];
    private banditYs: number[] = [...this.banditInitialYs];

    private banditAnim: Animation = new Animation(/bandit_idle_anim/);

    public constructor() {
        super();
        setTimeout(() => Game.getInstance().getCamera().shake(.5, EndingScene.HAND_MOVE_TIME - EndingScene.BANDIT_ARRIVE_TIME * 2), EndingScene.BANDIT_ARRIVE_TIME * 2);
    }

    public render(): void {
        let now = new Date().getTime();
        let timeSinceLastUpdate = now - this.lastUpdate;
        this.time += timeSinceLastUpdate;
        this.lastUpdate = now;

        super.clearCanvas('#000000');
        let handImage: HTMLImageElement;
        let banditImage: HTMLImageElement;
        if (this.time < EndingScene.SLAM_TIME) {
            handImage = Images.getImage(/ending_hand_a/);
            banditImage = this.banditAnim.getNextFrame();
            if (this.time < EndingScene.HAND_MOVE_TIME) {
                this.handY -= ((EndingScene.HAND_INITIAL_Y - World.tileSize) / EndingScene.HAND_MOVE_TIME) * (timeSinceLastUpdate);
            }
            for (let i: number = 0; i < 3; i++) {
                if (this.banditYs[i] > this.banditFinalYs[i]) {
                    this.banditYs[i] = this.banditYs[i] - (World.tileSize * 4 / EndingScene.BANDIT_ARRIVE_TIME) * timeSinceLastUpdate;
                }
            }
            // d = s * t
            // 64 = s * 5
            // 64 / 5 = s
            // s = 12.8 pixels per second
            super.renderImage(handImage, 0, this.handY);
        } else {
            handImage = Images.getImage(/ending_hand_b/);
            banditImage = Images.getImage(/bandit_dead/);
        }


        super.renderImage(Images.getImage(/ending_ground/), 0, 0 + World.tileSize);
        super.renderImage(Images.getImage(/ending_ground/), World.tileSize * World.tilesWide, 0 + World.tileSize);
        super.renderImage(Images.getImage(/ending_ground/), -World.tileSize * World.tilesWide, 0 + World.tileSize);

        if (this.time < EndingScene.SLAM_TIME) {
            for (let i: number = 0; i < 3; i++) {
                super.renderImage(banditImage, this.banditXs[i], this.banditYs[i]);
            }
        }

        if (this.time >= EndingScene.SLAM_TIME) {
            if (this.handY != World.tileSize) {
                this.handY = World.tileSize;
            }
            if (!this.slammed) {
                this.handY = World.tileSize - 32;
                Game.getInstance().getCamera().shake(1, 1000);
                this.slammed = true;
            }
            super.renderImage(Images.getImage(/ending_cracks/), 0, 0 + World.tileSize);
            for (let i: number = 0; i < 3; i++) {
                super.renderImage(banditImage, this.banditXs[i], this.banditYs[i]);
            }
            super.renderImage(handImage, 0, this.handY);
            if (this.time >= EndingScene.YOU_WIN_TEXT_TIME) {
                if (Math.floor(this.time / 500) % 2 == 0) {
                    super.renderImage(Images.getImage(/ending_you_win_text/), 0, 0 + World.tileSize);
                }
            }
        }

        if (this.time >= EndingScene.END_SCENE_TIME) {
            Game.getInstance().showCredits();
        }
    }
}
