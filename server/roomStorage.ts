import Player from "./classes/Player";
import Room from "./classes/Room";

export default class RoomStorage {
	rooms: Map<string, Room>;
	constructor() {
		this.rooms = new Map<string, Room>();
	}

	find(id: string): Room {
		return this.rooms.get(id);
	}

	save(room: Room): void {
	    this.rooms.set(room.id, room);
	}

    addPlayer(id: string, player: Player): void{
		this.find(id).addPlayer(player);
    }

    removePlayer(id: string, player: Player):void{
		this.find(id).addPlayer(player);
    }

	findAll(): Map<string, Room> {
		return this.rooms;
	}

    isEmpty(): boolean {
        return this.rooms.size === 0
    }
}