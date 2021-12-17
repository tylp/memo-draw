import Player from '../Player';
import Lobby from './Lobby';
import _, { shuffle } from 'lodash';
import type { Dayjs } from 'dayjs';
import GameMode from './GameMode/GameMode';
import PlayerErrorVoteManager from './PlayerErrorVoteManager/PlayerErrorVoteManager';
import Application from '../Application';
import dayjs from 'dayjs';

export default class Game {
	id: string;
	hostPlayerId: string;
	players: Array<Player>;
	currentPlayer: Player;
	losers: Array<Player> = [];
	gameMode: GameMode;
	hasEnded = false;
	winner: Player;

	currentDrawingIndex = 0;
	currentNumberOfDrawings = 0;
	currentDrawingIdentifier = 0;

	limitDate: Dayjs;
	playerErrorVoteManager = new PlayerErrorVoteManager();

	drawingEndTimeout: NodeJS.Timeout;

	constructor(lobby: Lobby, gameMode: GameMode) {
		this.id = lobby.id;
		this.hostPlayerId = lobby.hostPlayerId;
		this.players = shuffle(lobby.players);
		this.gameMode = gameMode;
		this.currentPlayer = this.players[0];
		this.refreshLimitDate();
	}

	protected refreshDrawingEndTimeout(): void {
		this.clearPreviousTimeoutIfPossible();
		this.createTimeout();
	}

	protected clearPreviousTimeoutIfPossible(): void {
		if (this.drawingEndTimeout) clearTimeout(this.drawingEndTimeout);
	}

	protected createTimeout(): void {
		const asyncCurrentDrawingIdentifier = this.currentDrawingIdentifier;
		this.drawingEndTimeout = setTimeout(() => {
			Application.nextDrawingFor(Application.getLobbyStorage().get(this.id), asyncCurrentDrawingIdentifier);
		}, this.limitDate.diff(dayjs(), 'milliseconds'))
	}

	protected refreshLimitDate(): void {
		this.limitDate = this.gameMode.getNewLimitDate(this);
		this.refreshDrawingEndTimeout();
	}

	public isTurnOf(player: Player): boolean {
		return this.currentPlayer?.id === player.id;
	}

	public nextDrawing(): void {
		this.currentDrawingIdentifier++;
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
		let newCurrentPlayer = this.gameMode.getNextPlayer(this);
		if (this.hasLost(newCurrentPlayer)) {
			newCurrentPlayer = this.gameMode.getNextPlayer(this);
		}
		this.currentPlayer = newCurrentPlayer
	}

	public hasLost(player: Player): boolean {
		return this.losers.map(e => e.id).includes(player.id);
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
		if (this.playerErrorVoteManager.selectedPlayer.id === this.currentPlayer.id) {
			this.nextPlayer();
		}
	}

	protected enoughPlayersRemainToPlay(): boolean {
		return this.players.length - this.losers.length > 1;
	}

	protected endGame(): void {
		this.clearPreviousTimeoutIfPossible();
		this.hasEnded = true;
		this.winner = this.getWinner();
	}

	protected getWinner(): Player {
		return this.getPlayersStillPlaying()[0];
	}

	public getPlayersStillPlaying(): Player[] {
		const idsOfPlayersStillPlaying = this.getIdsOfPlayersStillPlaying();
		return this.players.filter(e => idsOfPlayersStillPlaying.includes(e.id));
	}

	protected getIdsOfPlayersStillPlaying(): Player['id'][] {
		const idsOfPlayers = this.players.map(e => e.id);
		const idsOfLosers = this.losers.map(e => e.id);
		return _.difference<Player['id']>(idsOfPlayers, idsOfLosers)
	}
}
