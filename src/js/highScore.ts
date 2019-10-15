export default class HighScore {
    private name: string;
    private score: number;

    public constructor(name: string, score: number) {
        this.name = name;
        this.score = score;
    }

    public getName(): string {
        return this.name;
    }

    public getScore(): number {
        return this.score;
    }
}
