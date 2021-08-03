const app = require('express')();
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const roomIO = io.of("/room");

import Player from "./classes/Player";
import Application from "./classes/Application";
import IdGeneratorService from "./services/IdGeneratorService";

const next = require('next');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const memoDrawApp = Application.generateInstance(io);

io.use((socket, next) => {
	const sessionID = socket.handshake.auth.sessionID;
	if(sessionID){
		const session = memoDrawApp.sessionStore.findSession(sessionID);
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
	socket.sessionID = IdGeneratorService.generate();
	socket.userID = IdGeneratorService.generate();
	socket.username = username;
	next();
});


// socket.io server
io.on("connection", (socket) => {
	console.log('a user is connected');
	memoDrawApp.handleConnection(socket);
});

roomIO.use((socket, next) => {
	const sessionID = socket.handshake.auth.sessionID;
	if(sessionID){
		const session = memoDrawApp.sessionStore.findSession(sessionID);
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
	socket.sessionID = IdGeneratorService.generate();
	socket.userID = IdGeneratorService.generate();
	socket.username = username;
	next();
});

roomIO.on("connection", (socket) => {
	// persist session
	memoDrawApp.sessionStore.saveSession(socket.sessionID, {
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

		if (!Application.getInstance().roomStore.find(roomID)){
			return isUnknown();
		}
		else {
			console.log('joining-room: ', roomID);
			socket.join(roomID);
			socket.roomID = roomID;
			memoDrawApp.sessionStore.setSessionRoomID(user.sessionID, roomID);
			io.of('/room').in(roomID).emit("succesfull join");
			
			// send room players list to emmitter
			socket.emit("clients", memoDrawApp.sessionStore.findAllSessionsOfRoom(roomID));

			// send room players newcomer infos
			socket.to(roomID).emit("player connected", memoDrawApp.sessionStore.findSession(user.sessionID));

			// send room players a welcome message
			io.of('/room').in(roomID).emit("new message", {username: 'Memo-Draw Bot', content: `Bienvenue dans le ${Application.getInstance().roomStore.find(roomID).name} ${user.username} !`});

			// update nbPlayer in room
			Application.getInstance().roomStore.addPlayer(roomID, joiningPlayer);
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
		Application.getInstance().roomStore.removePlayer(socket.roomID, new Player(socket.userID, socket.username));
		io.of('/').emit('sub-nb-player', socket.roomID);

		// disconnecting emiter from the room
		socket.leave(socket.roomID);

		// resetting the roomID of the emitter
		Application.getInstance().sessionStore.setSessionRoomID(socket.sessionID, null)

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