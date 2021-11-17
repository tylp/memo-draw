import { Dayjs } from 'dayjs';
import type Game from '../Game';

export default abstract class GameMode {
	public abstract getNewLimitDate(game: Game): Dayjs;
}