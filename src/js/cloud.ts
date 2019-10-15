import { Images } from "./assets";
import WorldTile from "./worldTile";

export default class Cloud extends WorldTile {

    public constructor(x: number, y: number) {
        super([
            Images.getImage(/credits_cloud_a/),
            Images.getImage(/credits_cloud_b/),
            Images.getImage(/credits_cloud_c/)
        ], x, y);
    }
}
