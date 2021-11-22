import Player from '../Player';
import Lobby from './Lobby';
import { shuffle } from 'lodash';
import type { Dayjs } from 'dayjs';
import GameMode from './GameMode/GameMode';
import WrongDrawingVoteManager from './WrongDrawingVoteManager/WrongDrawingVoteManager';

export default class Game {
	id: string;
	hostPlayerId: string;
	players: Array<Player>;
	losers: Array<Player> = [];
	gameMode: GameMode;
	hasEnded = false;
	winner: Player;

	currentDrawingIndex = 0;
	currentNumberOfDrawings = 0;
	currentPlayerIndex = 0;

	limitDate: Dayjs;
	wrongDrawingVoteManager = new WrongDrawingVoteManager();

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
		if (this.currentPlayerIndex >= this.players.length - 1) {
			this.currentPlayerIndex = 0;
		} else {
			this.currentPlayerIndex++;
		}

		if (this.losers.includes(this.getCurrentPlayer())) {
			this.nextPlayer();
		}
	}

	protected getCurrentPlayer(): Player {
		return this.players[this.currentPlayerIndex];
	}

	public startVote(contestedDrawing: number): void {
		if (this.wrongDrawingVoteManager.canStartVote()) {
			const playersIds = new Set<Player['id']>(this.players.map(e => e.id));
			this.wrongDrawingVoteManager.startVote(contestedDrawing, playersIds);
		}
	}

	public endVote(): void {
		this.wrongDrawingVoteManager.endVote();

		const isDrawingValid = this.wrongDrawingVoteManager.currentVote.getBooleanWinner()

		if (!isDrawingValid) {
			this.playerLost(this.players[this.currentPlayerIndex]);
		}
	}

	protected playerLost(player: Player): void {
		this.losers.push(player);

		if (this.enoughPlayersRemainToPlay()) {
			this.nextPlayer();
			this.refreshLimitDate();
		} else {
			this.endGame();
		}
	}

	protected enoughPlayersRemainToPlay(): boolean {
		return this.players.length - this.losers.length > 1;
	}

	protected endGame(): void {
		this.hasEnded = true;
		this.winner = this.players[0];
	}
}
