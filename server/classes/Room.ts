import Player from "./Player";

export default class Room {
    id: string;
    players: Array<Player>;

    constructor(id: string) {
        this.id = id;
        this.players = [];
    }

    add(player: Player): Room {
        this.players.push(player);
        return this;
    }

    remove(player: Player): Room {
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
