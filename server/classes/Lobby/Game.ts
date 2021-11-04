import Player from '../Player';
import Lobby from './Lobby';
import { shuffle } from 'lodash';
import dayjs, { Dayjs } from 'dayjs';
import YesNoVote from '../Votes/YesNoVote';

const MIN_SECONDS_POSSIBLE = 4;
const MAX_SECONDS_POSSIBLE = 10;

export default class Game {
	id: string;
	hostPlayerId: string;
	players: Array<Player>;
	currentDrawingIndex = 0;
	currentNumberOfDrawings = 0;
	currentPlayerIndex = 0;
	limitDate: Dayjs;
	minSeconds = MIN_SECONDS_POSSIBLE;
	maxSeconds = MAX_SECONDS_POSSIBLE;
	currentVote?: YesNoVote | undefined;
	contestedDrawing?: number | undefined;

	constructor(lobby: Lobby) {
		this.id = lobby.id;
		this.hostPlayerId = lobby.hostPlayerId;
		this.players = shuffle(lobby.players);
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

	protected refreshLimitDate(): void {
		this.limitDate = dayjs().add(this.getSecondsToDraw(), 'seconds');
	}

	getSecondsToDraw(): number {
		if (this.currentDrawingIndex === 0)
			return this.maxSeconds;
		if (this.currentDrawingIndex >= 20)
			return this.minSeconds;
		return -2 * Math.log(this.currentDrawingIndex) + 10;
	}

	public startVote(contestedDrawing: number): void {
		if (this.canStartVote()) {
			const playersIds = new Set<Player['id']>(this.players.map(e => e.id));
			this.currentVote = new YesNoVote(playersIds);
			this.contestedDrawing = contestedDrawing;
		}
	}

	public canStartVote(): boolean {
		return (!this.currentVote) || (this.currentVote.isClosed);
	}

	public endVote(): void {
		this.currentVote?.close();
		this.contestedDrawing = undefined;
	}
}
