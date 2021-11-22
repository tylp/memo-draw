import Player from '../Player';
import Lobby from './Lobby';
import { shuffle } from 'lodash';
import type { Dayjs } from 'dayjs';
import GameMode from './GameMode/GameMode';
import PlayerErrorVoteManager from './PlayerErrorVoteManager/PlayerErrorVoteManager';

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
	playerErrorVoteManager = new PlayerErrorVoteManager();

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

		if (this.hasLost(this.getCurrentPlayer())) {
			this.nextPlayer();
		}
	}

	public hasLost(player: Player): boolean {
		return this.losers.map(e => e.id).includes(player.id);
	}

	protected getCurrentPlayer(): Player {
		return this.players[this.currentPlayerIndex];
	}

	public startVote(selectedPlayer: Player): void {
		if (this.playerErrorVoteManager.canStartVote()) {
			const playersIds = new Set<Player['id']>(this.players.map(e => e.id));
			this.playerErrorVoteManager.startVote(selectedPlayer, playersIds);
		}
	}

	public endVote(): void {
		this.playerErrorVoteManager.endVote();

		const playerHasMadeAnError = this.playerErrorVoteManager.currentVote.getBooleanWinner()

		if (playerHasMadeAnError) {
			this.playerLost(this.playerErrorVoteManager.selectedPlayer);
		}
	}

	protected playerLost(player: Player): void {
		this.losers.push(player);

		if (this.enoughPlayersRemainToPlay()) {
			this.skipPlayerIfNecessary();
			this.refreshLimitDate();
		} else {
			this.endGame();
		}
	}

	protected skipPlayerIfNecessary(): void {
		if (this.playerErrorVoteManager.selectedPlayer.id === this.getCurrentPlayer().id) {
			this.nextPlayer();
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
