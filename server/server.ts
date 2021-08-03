const app = require('express')();
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const roomIO = io.of("/room");

const cryptoRand = require('crypto');
const randomId = () => cryptoRand.randomBytes(8).toString("hex");

import SessionStorage from "./sessionStorage";
import RoomStorage from "./roomStorage";
import Player from "./classes/Player";
import Room from "./classes/Room";

const next = require('next');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const sessionStore = new SessionStorage();
const roomStore = new RoomStorage();

io.use((socket, next) => {
	const sessionID = socket.handshake.auth.sessionID;
	if(sessionID){
		const session = sessionStore.findSession(sessionID);
		if(session){
			socket.sessionID = sessionID;
			socket.userID = session.userID;
			socket.username = session.username;
			return next();
		}
	}
	const username = socket.handshake.auth.username;
	if (!username) {
		return next(new Error("invalid username"));
	}
	socket.sessionID = randomId();
	socket.userID = randomId();
	socket.username = username;
	next();
});

// socket.io server
io.on("connection", (socket) => {
	console.log('a user is connected');

	// persist session
	sessionStore.saveSession(socket.sessionID, {
		userID: socket.userID,
		username: socket.username,
		connected: true,
	});

	// socket.join(socket.userID);
	
	socket.emit("session", {
		sessionID: socket.sessionID,
		userID: socket.userID
	});

	// fetch existing users
	const users = [];
	sessionStore.findAllSessions().forEach((session) => {
		users.push({
		userID: session.userID,
		username: session.username,
		connected: session.connected,
		});
	});
	socket.emit("users", users);

	// fetch existing rooms
	if(!roomStore.isEmpty())
	{
		socket.emit("rooms", roomStore.findAll());
	}

	// notify existing users
	socket.broadcast.emit("user connected", {
		userID: socket.userID,
		username: socket.username,
		connected: true,
	});

	socket.on("create-room", function(msg){
		const roomID = randomId();
		console.log('create-room: ', msg);
		roomStore.save(new Room(roomID, "new room name"));
		io.emit('new-room', roomStore.find(roomID))
	});

	socket.on("manual-disconnect", () => {
		console.log("manual disconnect");
	});

	// notify users upon disconnection
	socket.on("disconnect", async () => {
		console.log('a user has been disconnected');
		const matchingSockets = await io.in(socket.userID).allSockets();
		const isDisconnected = matchingSockets.size === 0;
		if (isDisconnected) {
			// notify other users
			socket.broadcast.emit("user disconnected", socket.userID);
			// update the connection status of the session
			sessionStore.saveSession(socket.sessionID, {
				userID: socket.userID,
				username: socket.username,
				connected: false,
			});
		}
	});

});

roomIO.use((socket, next) => {
	const sessionID = socket.handshake.auth.sessionID;
	if(sessionID){
		const session = sessionStore.findSession(sessionID);
		if(session){
			socket.sessionID = sessionID;
			socket.userID = session.userID;
			socket.username = session.username;
			return next();
		}
	}
	const username = socket.handshake.auth.username;
	if (!username) {
		return next(new Error("invalid username"));
	}
	socket.sessionID = randomId();
	socket.userID = randomId();
	socket.username = username;
	next();
});

roomIO.on("connection", (socket) => {
	console.log('a user is connected to a room');
	
	// persist session
	sessionStore.saveSession(socket.sessionID, {
		userID: socket.userID,
		username: socket.username,
		connected: true,
	});

	// notify existing users
	io.of('/').emit('user connected', {
		userID: socket.userID,
		username: socket.username,
		connected: true,
	});
	
	socket.emit("session", {
		sessionID: socket.sessionID,
		userID: socket.userID,
		username: socket.username,
	});
	
	socket.on("joining-room", function(roomID, user, isUnknown){

		const joiningPlayer: Player = new Player(socket.userID, socket.username);

		if (!roomStore.find(roomID)){
			return isUnknown();
		}
		else {
			console.log('joining-room: ', roomID);
			socket.join(roomID);
			socket.roomID = roomID;
			sessionStore.setSessionRoomID(user.sessionID, roomID);
			io.of('/room').in(roomID).emit("succesfull join");
			
			// send room players list to emmitter
			socket.emit("clients", sessionStore.findAllSessionsOfRoom(roomID));

			// send room players newcomer infos
			socket.to(roomID).emit("player connected", sessionStore.findSession(user.sessionID));

			// send room players a welcome message
			io.of('/room').in(roomID).emit("new message", {username: 'Memo-Draw Bot', content: `Bienvenue dans le ${roomStore.find(roomID).name} ${user.username} !`});

			// update nbPlayer in room
			roomStore.addPlayer(roomID, joiningPlayer);
			io.of('/').emit('add-nb-player', roomID);
		}
	});

	socket.on("new message", (message, roomID) => {
		io.of('/room').in(roomID).emit("new message", {username: socket.username, content: message});
	})

	// Broadcast draw to everyone in the room
	socket.on('drawing', (data) => {
		socket.to(socket.roomID).emit('drawing', data)
	});

	// notify users upon disconnection
	socket.on("disconnect", async () => {
		// Prepering the emiter to leave the room

		console.log('user leaved room ', socket.userID);
		// substract nbPlayer of the room
		roomStore.removePlayer(socket.roomID, new Player(socket.userID, socket.username));
		io.of('/').emit('sub-nb-player', socket.roomID);

		// disconnecting emiter from the room
		socket.leave(socket.roomID);

		// resetting the roomID of the emitter
		sessionStore.setSessionRoomID(socket.sessionID, null)

		// alert room players to revome the emitter
		socket.to(socket.roomID).emit("player disconnected", socket.userID);

		// reset roomID of emitting socket
		socket.roomID = null;

		socket.broadcast.emit("user disconnected", socket.userID);
	});
});


nextApp.prepare().then(() => {
	app.get('*', (req, res) => nextHandler(req, res));

	server.listen(port, (err) => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port}`);
	});
});