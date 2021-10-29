import Application from './Application';
import { Game } from './Game';
import Player from './Player';
import { random } from 'lodash';

export default class Lobby {
	id: string;
	hostPlayerId: string;
	players: Array<Player>;
	hasStarted: boolean;
	game: Game;

	constructor(id: string, hostPlayerId: string) {
		this.id = id;
		this.hostPlayerId = hostPlayerId;
		this.hasStarted = false;
		this.players = [];
	}

	add(player: Player): this {
		this.players.push(player);
		return this;
	}

	remove(playerId: string): this {
		const index = this.players.findIndex(e => e.id === playerId);
		if (index !== -1) {
			this.players.splice(index, 1);
			if (this.hostIs(playerId)) {
				this.assignRandomHost();
			}
		}

		return this;
	}

	isPlayerPresent(playerId: Player['id']): boolean {
		return this.players.findIndex(e => e.id === playerId) !== -1;
	}

	hostIs(playerId: string): boolean {
		return this.hostPlayerId === playerId;
	}

	isEmpty(): boolean {
		return this.players.length === 0;
	}

	startGame(): Game {
		if (!this.game) {
			this.hasStarted = true;
			this.game = new Game(this);
			Application.getLobbyStorage().set(this.id, this);
		}
		return this.game;
	}

	static getLobbyName(roomId: Lobby['id']): string {
		return `room-${roomId}`;
	}

	getSocketLobbyName(): string {
		return Lobby.getLobbyName(this.id);
	}

	assignRandomHost(): void {
		this.assignHost(this.players[random(this.players.length - 1)]?.id);
	}

	assignHost(playerId: string): void {
		this.hostPlayerId = playerId;
	}

	hasHost(): boolean {
		return !!this.hostPlayerId;
	}
}
