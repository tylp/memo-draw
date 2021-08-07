import Player from "./Player";

export default class Room {
    id: string;
    name: string;
    players: Array<Player>;

    constructor(id: string) {
        this.id = id;
        this.name = "Player's room";
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

    isPlayerPresent(player: Player): boolean {
        return this.players.findIndex(e => e.id === player.id) !== -1;
    }

    static getRoomName(roomId: Room['id']): string {
        return `room-${roomId}`;
    }
}