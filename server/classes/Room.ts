import Player from "./Player";

export default class Room {
    id: string;
    name: string;
    players: Array<Player>;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.players = [];
    }

    addPlayer(player: Player): Room {
        this.players.push(player);
        return this;
    }

    removePlayer(player: Player): Room {
        const index = this.players.findIndex(e => e.id === player.id);
        if(index !== -1) {
            this.players.splice(index);
        }
        return this;
    }
}