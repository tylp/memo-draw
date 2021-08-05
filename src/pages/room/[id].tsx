import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import {useSocketRoom} from '../../hooks';
import Link from 'next/link';
import { Layout, Title } from '../../components/Common';
import Button from '../../components/Common/Button/Button';
import Loading from '../../components/Common/Loading/Loading';
import Canvas from '../../components/Canvas';

const Room = () => {
	const router = useRouter();
	const { id } = router.query;
	const socket = useSocketRoom();
	const [url, setUrl] = useState('');
	const [usersList, setUsersList] = useState([]);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [roomID, setRoomID] = useState('');
	const [user, setUser] = useState({sessionID: '', userID: '', username: ''});
	const [inRoom, setInRoom] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isConnected, setIsConnected] = useState(false);
	const [isValidRoom, setIsValidRoom] = useState(true);
	const [broadcastedCoords, setBroadcastedCoords] = useState(null);

	//executed when component is updated
	useEffect(() => {
		console.log('players: ', usersList);
		if(!roomID && router.query.id){
			setRoomID(router.query.id.toString());			
		}
		if(roomID && isConnected && !inRoom && isLoading)
		{			
			socket.emit("joining-room", 
				roomID, 
				{
					sessionID: user.sessionID, 
					userID: user.userID,
					username: user.username
				},
				// Callback executed when no room correspond to the roomID
				() => {
					setIsValidRoom(false)
				}
			);
			setInRoom(true)
			setIsLoading(false);
		}
	});

	//executed when component is created (one time)
	useEffect(() => {
		// store the current room url to be able to save it to paperclip later
		setUrl(window.location.href.toString());

		const sessionID = localStorage.getItem("sessionID");
		
		if (sessionID) {
			setIsLoading(false)
			setIsConnected(true)
		}
		
		socket.on("session", ({ sessionID, userID, username }) => {
			// attach the session ID to the next reconnection attempts
			socket.auth = { sessionID };
			// store it in the localStorage
			localStorage.setItem("sessionID", sessionID);
			// save the ID & name of the user
			socket.userID = userID;
			socket.username = username;

			setUser({
				sessionID: socket.auth.sessionID, 
				userID: socket.userID,
				username: socket.username
			});
			
			setIsConnected(true);
		});

		socket.on("clients", (clients) => {
			setUsersList(clients);
		})

		socket.on("player connected", (newUser) => {
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
			setMessages((prevList) => [...prevList, message]);
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
			// TODO: inform user that link is in his clipboard now		
		});
	}

	const emitCoords = (coords) => {
		socket.emit('drawing', coords);
	}

	return (
		<div>
			{isLoading ? 
				<Loading/>
			: 
			!isConnected ? 
				<Layout>
					<Title>Vous devez vous connecter: </Title>
					<Button><a href="/">Se connecter</a></Button>
				</Layout> 
			:
			!isValidRoom ? 
				<Layout>
					<Title>Ce salon n`&apos;`existe pas, veuillez reessayer: </Title>
					<Button><a href="/">Créer un salon / rejoindre un salon</a></Button>
				</Layout> 
			:			
				<Layout>
					<Link href="/">
						<a><Button>&larr; Quitter le salon</Button></a>
					</Link>
					<p className="text-white-white font-bold">Room: {id}</p>
					<p className="text-white-white font-bold">Socket: {user.sessionID}</p>
					<Canvas width="800" height="400"
						emitCoords={emitCoords}
						broadcastedCoords={broadcastedCoords}
					/>
					<p className="text-white-white font-bold">utilisateurs: {JSON.stringify(usersList)}</p>
					<Button onClick={paperClip}>Envoyer le lien à vos amis</Button>
					<Title>Messages du salon :</Title>
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
						<Button onClick={sendMessage}>
							Envoyer
						</Button>
					</form>
					<p>&nbsp;</p>
				</Layout>
			}
		</div>
	)
}

export default Room;