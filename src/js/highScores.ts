import Drawable from './drawable';
import UIBackground from './uiBackground';
import Game from './game';
import ScoresRepository from './scoresRepository';
import HighScore from './highScore';
import { Images } from './assets';

export default class HighScores extends UIBackground {

    public static MAX_SCORES: number = 7;
    private static MAX_NAME_LENGTH: number = 8;
    private static LETTERS = '-abcdefghijklmnopqrstuvwxyz ';

    private scoresRepository: ScoresRepository;

    private scores: HighScore[];
    private newScore: number;
    private newName: string;
    private currentCharPos: number;
    private currentChar: number;
    private enteringHighScore: boolean = false;
    private newScoreLineNumber: number = 0;
    private randomId = Math.floor(Math.random() * 1000);

    public constructor(scoresRepository: ScoresRepository) {
        super();
        this.scoresRepository = scoresRepository;
        // if (this.scores.size < HighScores.MAX_SCORES || Game.getInstance().getCurrentScore() > this.getMinScore()) {
        //     this.newScore = Game.getInstance().getCurrentScore();
        // }
        window.addEventListener('keydown', this.handleKeyboardEvent.bind(this));
    }

    public initialize(): void {
        this.newName = '';
        this.currentCharPos = 0;
        this.currentChar = 0;
        this.scores = this.scoresRepository.getHighScores();
        let currentScore = Game.getInstance().getCurrentScore();
        if (currentScore >= this.getMinScore() || this.scores.length < HighScores.MAX_SCORES) {
            this.newScore = currentScore;
            this.enteringHighScore = true;
        }
    }

    public isEnteringHighScore(): boolean {
        return this.enteringHighScore;
    }

    public update() {
        super.update();
        // if (!this.initialized && !this.newScore) {

        // }
    }

    public render() {
        super.render();

        super.renderImage(Images.getImage(/gametext_highscores/), 32, 6);
        super.renderImage(Images.getImage(/highscore_accent/), 33, 22);

        let i: number = 0;
        this.getSortedScores().forEach(s => {
            let scoreText = s.getScore().toString().padStart(5, '_');
            let nameText = ((i + 1) + '.' + s.getName()).padEnd(12, '_');
            if (this.enteringHighScore && i === this.newScoreLineNumber) {
                super.renderTextFlash(nameText + scoreText, 3, 32 + i * 16, this.currentCharPos + 2);
            } else {
                super.renderText(nameText + scoreText, 3, 32 + i * 16);
            }
            i++;
        });

    }

    private getMinScore(): number {
        let minScore = Number.MAX_VALUE;
        this.scores.forEach(s => {
            if (s.getScore() < minScore) {
                minScore = s.getScore();
            }
        });
        return minScore;
    }

    private getSortedScores(): HighScore[] {
        let newScores = [...this.scores];
        let newScoreName: string;
        if (this.enteringHighScore) {
            newScoreName = this.newName.padEnd(HighScores.MAX_NAME_LENGTH, '-');
            newScores.push(new HighScore(newScoreName, this.newScore));
        }
        newScores.sort((a, b) => b.getScore() - a.getScore());
        newScores = newScores.slice(0, HighScores.MAX_SCORES);
        if (this.enteringHighScore) {
            for (let i: number = 0; i < newScores.length; i++) {
                if (newScores[i].getName() === newScoreName) {
                    this.newScoreLineNumber = i;
                }
            }
        }
        return newScores;
    }

    private handleKeyboardEvent(e: KeyboardEvent): void {
        if (Game.getInstance().isHighScore()) {
            if (this.enteringHighScore) {
                switch (e.key) {
                    case 'ArrowUp':
                    case 'w':
                        this.currentChar += 1;
                        this.adjustCurrentChar();
                        break;
                    case 'ArrowDown':
                    case 's':
                        this.currentChar -= 1;
                        this.adjustCurrentChar();
                        break;
                    case ' ':
                    case 'Enter':
                        if (this.currentChar === 0 || this.currentCharPos >= HighScores.MAX_NAME_LENGTH) {
                            this.submitHighScore();
                        } else {
                            this.currentChar = 0;
                            this.currentCharPos += 1;
                            this.adjustCurrentChar();
                        }
                }
            } else {
                switch (e.key) {
                    case ' ':
                    case 'Enter':
                        Game.getInstance().closeHighScores();
                }
            }
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
        }
    }

    private subIndex(original: string, sub: string, pos: number) {
        return original.substr(0, pos) + sub + original.substr(pos + 1, original.length);
    }

    private adjustCurrentChar(): void {
        if (this.currentChar < 0) {
            this.currentChar = HighScores.LETTERS.length - 1;
        }
        if (this.currentChar > HighScores.LETTERS.length - 1) {
            this.currentChar = 0;
        }
        this.newName = this.subIndex(this.newName, HighScores.LETTERS.charAt(this.currentChar), this.currentCharPos);
    }

    private submitHighScore(): void {
        this.newName = this.newName.replace('-', '');
        this.scoresRepository.saveScore(new HighScore(this.newName, this.newScore));
        this.scores.push(new HighScore(this.newName, this.newScore));
        this.newName = undefined;
        this.newScore = undefined;
        this.enteringHighScore = false;
    }
}
