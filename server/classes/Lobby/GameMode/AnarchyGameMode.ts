import dayjs, { Dayjs } from 'dayjs';
import type { Player } from '../..';
import type Game from '../Game';
import GameMode from './GameMode';

export default class AnarchyGameMode extends GameMode {
	public getNewLimitDate(): Dayjs {
		return dayjs().add(2, 'seconds');
	}

	public getNextPlayer(game: Game): Player {
		return game.players[0];
	}
}