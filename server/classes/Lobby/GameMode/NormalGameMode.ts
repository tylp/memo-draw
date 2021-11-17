import dayjs, { Dayjs } from 'dayjs';
import type Game from '../Game';
import GameMode from './GameMode';

const MIN_SECONDS_POSSIBLE = 4;
const MAX_SECONDS_POSSIBLE = 10;

export default class NormalGameMode extends GameMode {
	public getNewLimitDate(game: Game): Dayjs {
		return dayjs().add(this.getSecondsToDraw(game), 'seconds');
	}

	protected getSecondsToDraw(game: Game): number {
		if (game.currentDrawingIndex === 0)
			return MAX_SECONDS_POSSIBLE;
		if (game.currentDrawingIndex >= 20)
			return MIN_SECONDS_POSSIBLE;
		return -2 * Math.log(game.currentDrawingIndex) + 10;
	}
}