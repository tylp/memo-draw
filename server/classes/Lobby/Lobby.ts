import { ISocketJsonable } from './../../interfaces/ISocketJsonable';
import { GameModeProperty } from './../../enums/GameProperties';
import Application from '../Application';
import { Game, Player } from '..';
import { random } from 'lodash';
import GameModeFactory from './GameMode/GameModeFactory';
import { IHasSocketRoom } from 'server/interfaces/IHasSocketRoom';

export default class Lobby implements IHasSocketRoom, ISocketJsonable {
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

	toSocketJson(): unknown {
		const toSocketJson = { ...this }
		if (toSocketJson?.game?.drawingEndTimeout)
			delete toSocketJson.game.drawingEndTimeout;
		return toSocketJson;
	}

	add(player: Player): this {
		this.players.push(player);
		return this;
	}

	remove(playerId: string): this {
		const index = this.players.findIndex(e => e.id === playerId);
		if (index !== -1) {
			this.players.splice(index, 1);
			if (this.isPlayerHost(playerId)) {
				this.assignRandomHost();
			}
		}

		return this;
	}

	isPlayerPresent(playerId: Player['id']): boolean {
		return this.players.findIndex(e => e.id === playerId) !== -1;
	}

	isPlayerHost(playerId: string): boolean {
		return this.hostPlayerId === playerId;
	}

	isEmpty(): boolean {
		return this.players.length === 0;
	}

	startGame(gameModeProperty: GameModeProperty): Game {
		if (!this.game) {
			this.hasStarted = true;
			this.game = new Game(this, GameModeFactory.create(gameModeProperty));
			Application.getLobbyStorage().set(this.id, this);
		}
		return this.game;
	}

	endGame(): this {
		this.game = undefined;

		return this;
	}

	static getLobbyName(lobbyId: Lobby['id']): string {
		return `lobby-${lobbyId}`;
	}

	getSocketRoomName(): string {
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
