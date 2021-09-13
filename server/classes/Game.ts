import Player from "./Player";
import Room from "./Room";

export class Game {
    id: string;
    creatorPlayerId: string;
    players: Array<Player>;
    currentTurnPlayerId: string;

    constructor(room: Room) {
        this.id = room.id;
        this.creatorPlayerId = room.creatorPlayerId;
        this.players = room.players;
    }
}