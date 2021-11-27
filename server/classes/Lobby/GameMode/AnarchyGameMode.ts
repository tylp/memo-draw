import dayjs, { Dayjs } from 'dayjs';
import { random } from 'lodash';
import type { Player } from '../..';
import type Game from '../Game';
import GameMode from './GameMode';

export default class AnarchyGameMode extends GameMode {
	public getNewLimitDate(): Dayjs {
		return dayjs().add(2, 'seconds');
	}

	public getNextPlayer(game: Game): Player {
		return this.getRandomPlayer(game);
	}

	protected getRandomPlayer(game: Game): Player {
		const randomIndex = random(game.players.length - 1);
		return game.players[randomIndex];
	}
}