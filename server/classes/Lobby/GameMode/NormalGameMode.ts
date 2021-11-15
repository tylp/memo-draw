import dayjs, { Dayjs } from 'dayjs';
import GameMode from './GameMode';

const MIN_SECONDS_POSSIBLE = 4;
const MAX_SECONDS_POSSIBLE = 10;

export default class NormalGameMode extends GameMode {
	public getNewLimitDate(): Dayjs {
		return dayjs().add(this.getSecondsToDraw(), 'seconds');
	}

	protected getSecondsToDraw(): number {
		if (this.game.currentDrawingIndex === 0)
			return MAX_SECONDS_POSSIBLE;
		if (this.game.currentDrawingIndex >= 20)
			return MIN_SECONDS_POSSIBLE;
		return -2 * Math.log(this.game.currentDrawingIndex) + 10;
	}
}