import { Dayjs } from 'dayjs';
import Game from '../Game';

export default abstract class GameMode {
	protected game: Game;

	constructor(game: Game) {
		this.game = game;
	}

	public abstract getNewLimitDate(): Dayjs;
}