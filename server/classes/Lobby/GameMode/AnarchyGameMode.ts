import dayjs, { Dayjs } from 'dayjs';
import GameMode from './GameMode';

export default class AnarchyGameMode extends GameMode {
	public getNewLimitDate(): Dayjs {
		return dayjs().add(2, 'seconds');
	}
}