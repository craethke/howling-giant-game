import Drawable from './drawable';
import { Images } from './assets';

export default class Bandit extends Drawable {

    public constructor() {
        super();
    }

    public render(): void {
        this.renderImage(Images.bandit, this.x, this.y);
    }

}
