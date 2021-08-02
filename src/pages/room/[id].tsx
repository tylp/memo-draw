import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import {useSocketRoom} from '../../hooks';
import Link from 'next/link';
import { Layout, Title } from '../../components/Common';
import Button from '../../components/Common/Button/Button';
import Loading from '../../components/Common/Loading/Loading';
import Draw from '../../components/CustomCanvas';
import Canvas from '../../components/Canvas';
import { getMaxListeners } from 'process';
import { getSystemErrorMap } from 'util';

const Room = () => {
	const btnStyle = {
		flex: 0.3,
		fontWeight: 'bold', 
		color:'white', 
		backgroundColor: 'black', 
		padding: 4
	}
	const router = useRouter();
	const { id } = router.query;
	const socket = useSocketRoom();
	const [url, setUrl] = useState('');
	const [usersList, setUsersList] = useState([]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [roomID, setRoomID] = useState(id);
    const [user, setUser] = useState({});
    const [inRoom, setInRoom] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [isValidRoom, setIsValidRoom] = useState(true);
	const [coord, setCoord] = useState({x: 0, y: 0});
	const [broadcastedCoords, setBroadcastedCoords] = useState(null);

	//executed when component is updated
	useEffect(() => {
		console.log('players: ', usersList);
		if(!roomID)
			setRoomID(router.query.id);
		if(roomID && isConnected && !inRoom)
		{

			socket.emit("joining-room", 
				roomID, 
				{
					sessionID: socket.auth.sessionID, 
					userID: socket.userID,
					username: socket.username
				},
				// Callback executed when no room correspond to the roomID
				() => {
					setIsValidRoom(false)
				}
			);
			setInRoom(true)
		}
	}, [usersList, roomID, isConnected, inRoom, socket, router.query.id]);

	// useEffect(() => {
	// 	if(coord.x && coord.y){
	// 		socket.emit('drawing', {
	// 			x: coord.x,
	// 			y: coord.y,
	// 			// x1: x1 / w,
	// 			// y1: y1 / h,
	// 			// color: color
	// 		});
	// 	}
	// }, [coord])

	//executed when component is created (one time)
	useEffect(() => {
		// store the current room url to be able to save it to paperclip later
		setUrl(window.location.href.toString());
		console.log('je passe !');

		const sessionID = localStorage.getItem("sessionID");
		console.log('sessionID: ', sessionID);
		if (sessionID) {
			console.log('un session existe');
			socket.auth = { sessionID };
			socket.connect();
		}
		else {
			setIsLoading(false)
			setIsConnected(false)
		}

		socket.on("connect", () => {
			setIsLoading(false);
			setIsConnected(true);
			console.log('connect');
        });

		socket.on("connect_error", (err) => {
			console.log(err);
            if (err.message === "invalid username") {
				setIsLoading(false);
            }
        });
		
		// socket.onAny((event, ...args) => {
		// 	console.log(event, args);
		// });

		socket.on("session", ({ sessionID, userID, username }) => {
			console.log('hydrating session');
			
			// attach the session ID to the next reconnection attempts
			socket.auth = { sessionID };
			// store it in the localStorage
			localStorage.setItem("sessionID", sessionID);
			// save the ID of the user
			socket.userID = userID;
			console.log('username: ', username);
			
			socket.username = username;

			setUser({
				sessionID: socket.auth.sessionID, 
				userID: socket.userID,
				username: socket.username
			});
		});

		socket.on("clients", (clients) => {
			setUsersList(clients);
		})

		socket.on("player connected", (newUser) => {
            console.log('a new player joined the room');
			let inList = false
			usersList.forEach((user) => {
				if (user.userID === newUser.userID)
					inList = true
			});
			if(!inList)
				setUsersList((prevList) => [...prevList, newUser]);
        });

		socket.on("player disconnected", (oldUserID) => {
            setUsersList((prevList) => prevList.filter((user) => user.userID !== oldUserID));
        });

		socket.on("new message", (message) => {
            console.log(`message: ${message.content}`);
            setMessages((prevList) => [...prevList, message]);
			// console.log('usersList', usersList);
        });

		socket.on('drawing', (broadcastedCoords) => {
			setBroadcastedCoords(broadcastedCoords)
		});

		window.onbeforeunload = (e) => {
			socket.off("session");
			socket.off("connect");
			socket.off("joining-room");
			socket.off("clients");
			socket.off('new message');
			socket.off("player connected");
			socket.off("player disconnected");
			socket.close();
			console.log('client off window');
		};

		return () => {
			socket.off("session");
			socket.off("connect");
			socket.off("joining-room");
			socket.off("clients");
			socket.off('new message');
			socket.off("player connected");
			socket.off("player disconnected");
			socket.close();
			console.log('client off component');
		}
	}, []);

	const handleMessage = (e) => {
		setMessage(e.currentTarget.value);
	}

	const sendMessage = (e) => {
		e.preventDefault();
		setMessage('');
		socket.emit("new message", message, roomID);
	}

	const paperClip = (e) => {
		e.preventDefault();
		navigator.clipboard.writeText(url).then(function() {
			console.log('url: ', url);
			
		}, function() {
			console.log('fail');
		});
	}

	const emitCoords = (coords) => {
		socket.emit('drawing', coords);
	}

	// function handleBroadcastedCoords(data){
	// 	setBroadcastedCoords(data)
	// }

	return (
		
		<div>
			{isLoading ? <Loading/>
			: 
			!isConnected ? 
			<Layout>
				<Title>Vous devez vous connecter: </Title>
				<Button><a href="/">Se connecter</a></Button>
			</Layout> 
			:
			!isValidRoom ? 
			<Layout>
				<Title>Ce salon n'existe pas, veuillez reessayer: </Title>
				<Button><a href="/">Créer un salon / rejoindre un salon</a></Button>
			</Layout> 
			:
			<Layout>
				<Link href="/">
					<Button>&larr; Quitter le salon</Button>
				</Link>
				<p className="text-white-white font-bold">Room: {id}</p>
				<p className="text-white-white font-bold">Socket: {user.sessionID}</p>
				<Canvas width="800" height="400"
					emitCoords={emitCoords}
					broadcastedCoords={broadcastedCoords}
					// style={{height: '50%', backgroundColor: 'white'}}
				/>
				<p className="text-white-white font-bold">utilisateurs: {JSON.stringify(usersList)}</p>
				<Button onClick={paperClip}>Envoyer le lien à vos amis</Button>
				<Title className="text-pink-pink">Messages du salon :</Title>
				<ul>
					{messages.map((msg, key) => (
					<li className="text-white-white" key={key}>
						<span className="text-white-white font-bold">{msg.username}:</span> {msg.content}
					</li>
					))}
				</ul>
				<form action="" style={{display: 'flex'}}>
					<input 
					type="text" 
					onChange={handleMessage} 
					value={message}
					className="bg-blue-200 w-full border-2 rounded border-yellow-light-yellow pl-2 text-white-white"/>
					<Button
					// type="submit" 
					onClick={sendMessage}>
						Envoyer
					</Button>
				</form>
				<p>&nbsp;</p>
			</Layout>
			// <div style={{backgroundColor: 'lightgrey', position: 'fixed', width: '100%', height: '100%'}}>
				
			// </div>
			}
		</div>
	)
}

export default Room;