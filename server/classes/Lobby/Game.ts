import Player from '../Player';
import Lobby from './Lobby';
import { shuffle } from 'lodash';
import type { Dayjs } from 'dayjs';
import YesNoVote from '../Votes/YesNoVote';
import GameMode from './GameMode/GameMode';

export default class Game {
	id: string;
	hostPlayerId: string;
	players: Array<Player>;
	gameMode: GameMode;

	currentDrawingIndex = 0;
	currentNumberOfDrawings = 0;
	currentPlayerIndex = 0;

	limitDate: Dayjs;
	currentVote?: YesNoVote | undefined;
	contestedDrawing?: number | undefined;

	constructor(lobby: Lobby, gameMode: GameMode) {
		this.id = lobby.id;
		this.hostPlayerId = lobby.hostPlayerId;
		this.players = shuffle(lobby.players);
		this.gameMode = gameMode;
		this.refreshLimitDate();
	}

	protected refreshLimitDate(): void {
		this.limitDate = this.gameMode.getNewLimitDate(this);
	}

	public isTurnOf(player: Player): boolean {
		return this.players[this.currentPlayerIndex].id === player.id;
	}

	public nextDrawing(): void {
		this.refreshLimitDate();
		if (this.currentDrawingIndex === this.currentNumberOfDrawings) {
			this.currentNumberOfDrawings++;
			this.nextPlayer();
		} else {
			this.currentDrawingIndex++;
		}
	}

	public nextPlayer(): void {
		this.currentDrawingIndex = 0;
		if (this.currentPlayerIndex === this.players.length - 1) {
			this.currentPlayerIndex = 0;
		} else {
			this.currentPlayerIndex++;
		}
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
