export default class RoomStorage {
	rooms;
	constructor() {
		this.rooms = [];
	}

	findRoom(id:string):any {
		return this.rooms.find((room) => room.id === id);
	}

	saveRoom(id:string):void {
	    this.rooms.push({
            id : id, 
            name: "Salon "+(parseInt(this.rooms.length)+1), 
            nbPlayer: 0
        });
	}

    addNbPlayer(id:string):void{
		this.rooms.find((room) => room.id = id).nbPlayer++;
    }

    subNbPlayer(id:string):void{
		this.rooms.find((room) => room.id = id).nbPlayer--;
    }

	findAllRooms():any{
		return this.rooms;
	}

    isEmpty():boolean{
        return this.rooms.length === 0
    }
}