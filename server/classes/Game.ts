import Player from './Player';
import Room from './Room';
import { shuffle } from 'lodash';
import dayjs, { Dayjs } from 'dayjs';

const MIN_SECONDS_POSSIBLE = 4;
const MAX_SECONDS_POSSIBLE = 10;

export class Game {
	id: string;
	creatorPlayerId: string;
	players: Array<Player>;
	currentDrawingIndex = 0;
	currentNumberOfDrawings = 0;
	currentPlayerIndex = 0;
	limitDate: Dayjs;
	minSeconds = MIN_SECONDS_POSSIBLE;
	maxSeconds = MAX_SECONDS_POSSIBLE;

	constructor(room: Room) {
		this.id = room.id;
		this.creatorPlayerId = room.creatorPlayerId;
		this.players = shuffle(room.players);
		this.refreshLimitDate();
	}

	isTurnOf(player: Player): boolean {
		return this.players[this.currentPlayerIndex].id === player.id;
	}

	nextDrawing(): void {
		this.refreshLimitDate();
		if (this.currentDrawingIndex === this.currentNumberOfDrawings) {
			this.currentNumberOfDrawings++;
			this.nextPlayer();
		} else {
			this.currentDrawingIndex++;
		}
	}

	nextPlayer(): void {
		this.currentDrawingIndex = 0;
		if (this.currentPlayerIndex === this.players.length - 1) {
			this.currentPlayerIndex = 0;
		} else {
			this.currentPlayerIndex++;
		}
	}

	refreshLimitDate(): void {
		this.limitDate = dayjs().add(this.getSecondsToDraw(), 'seconds');
	}

	getSecondsToDraw(): number {
		if (this.currentDrawingIndex === 0)
			return this.maxSeconds;
		if (this.currentDrawingIndex >= 20)
			return this.minSeconds;
		return -2 * Math.log(this.currentDrawingIndex) + 10;
	}
}
