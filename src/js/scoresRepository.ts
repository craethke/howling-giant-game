import HighScore from './highScore';
import HighScores from './highScores';

export default class ScoresRepository {

    private static STORAGE_KEY: string = 'hggame_highscores';

    public getHighScores(): HighScore[] {
        let scores: Object[] = JSON.parse(window.localStorage.getItem(ScoresRepository.STORAGE_KEY));
        if (!scores) {
            scores = [
                {
                    'name': 'Cody',
                    'score': 30000
                },
                {
                    'name': 'Jackson',
                    'score': 15000
                },
                {
                    'name': 'Zach',
                    'score': 10000
                },
                {
                    'name': 'Sebastian',
                    'score': 7000
                },
                {
                    'name': 'Tom',
                    'score': 5000
                },
                {
                    'name': 'Trucker',
                    'score': 3000
                },
                {
                    'name': 'Huntress',
                    'score': 1000
                },
            ];
        }
        scores = scores.slice(0, HighScores.MAX_SCORES);
        return scores.map(s => this.parseHighScore(s));
    }

    public saveScore(highScore: HighScore) {
        let scores = this.getHighScores();
        scores.sort((a, b) => b.getScore() - a.getScore());
        scores.push(highScore);
        scores = scores.slice(0, HighScores.MAX_SCORES);
        window.localStorage.setItem(ScoresRepository.STORAGE_KEY,
            JSON.stringify(scores));
    }

    private parseHighScore(object: any): HighScore {
        return new HighScore(object.name, object.score);
    }
}
