export default class Camera {

    private x: number = 0;
    private y: number = 0;

    private shakeInterval: any;
    private stopShakeTimeout: any;

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public shake(intensity: number, duration: number) {
        if (this.shakeInterval) {
            this.stopShake();
        }

        this.shakeInterval = window.setInterval((() => this.updateShake(intensity)), 1);
        this.stopShakeTimeout = setTimeout(this.stopShake.bind(this), duration);
    }

    public updateShake(intensity: number): void {
        let shakeOffsetX = (Math.random() * 2 - 1) * intensity;
        let shakeOffsetY = (Math.random() * 2 - 1) * intensity;
        this.x = shakeOffsetX;
        this.y = shakeOffsetY;
    }

    private stopShake(): void {
        clearInterval(this.shakeInterval);
        clearTimeout(this.stopShakeTimeout);
        this.shakeInterval = null;
        this.stopShakeTimeout = null;
        this.x = 0;
        this.y = 0;
    }
}
