import dayjs, { Dayjs } from 'dayjs';
import type { Player } from '../..';
import type Game from '../Game';
import GameMode from './GameMode';

const MIN_SECONDS_POSSIBLE = 8;
const MAX_SECONDS_POSSIBLE = 15;

export default class ClassicGameMode extends GameMode {
	protected currentPlayerIndex = 0;

	public getNewLimitDate(game: Game): Dayjs {
		return dayjs().add(this.getSecondsToDraw(game), 'seconds');
	}

	protected getSecondsToDraw(game: Game): number {
		if (game.currentDrawingIndex === 0)
			return MAX_SECONDS_POSSIBLE;
		if (game.currentDrawingIndex >= 20)
			return MIN_SECONDS_POSSIBLE;
		return -2 * Math.log(game.currentNumberOfDrawings) + 15;
	}

	public getNextPlayer(game: Game): Player {
		game.currentDrawingIndex = 0;
		if (this.currentPlayerIndex >= game.players.length - 1) {
			this.currentPlayerIndex = 0;
		} else {
			this.currentPlayerIndex++;
		}

		return game.players[this.currentPlayerIndex];
	}
}