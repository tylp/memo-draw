import Player from "./Player";

export default class Room {
    id: string;
    creatorPlayerId: string;
    players: Array<Player>;

    constructor(id: string, creatorPlayerId: string) {
        this.id = id;
        this.creatorPlayerId = creatorPlayerId;
        this.players = [];
    }

    add(player: Player): Room {
        this.players.push(player);
        return this;
    }

    remove(player: Player): Room {
        const index = this.players.findIndex(e => e.id === player.id);
        if(index !== -1) {
            this.players.splice(index, 1);
        }
        return this;
    }

    isPlayerPresent(player: Player): boolean {
        return this.players.findIndex(e => e.id === player.id) !== -1;
    }

    isEmpty(): boolean {
        return this.players.length === 0;
    }

    static getRoomName(roomId: Room['id']): string {
        return `room-${roomId}`;
    }
}
