import { Dayjs } from 'dayjs';
import type { Player } from '../..';
import type Game from '../Game';

export default abstract class GameMode {
	public abstract getNewLimitDate(game: Game): Dayjs;

	public abstract getNextPlayer(game: Game): Player;
}