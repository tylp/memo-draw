import React, { useEffect, useState } from 'react';
import { useSocketRoom} from '../../hooks';
import Link from 'next/link';
import { Layout, Title } from '../../components/Common';
import Button from '../../components/Common/Button/Button';
import Loading from '../../components/Common/Loading/Loading';
import Canvas from '../../components/Canvas';
import useLocalStorage from '../../hooks/useLocalStorage';
import RoomService from '../../services/RoomService';
import IProfile from '../../../server/interfaces/IProfile';

const Room = (): JSX.Element => {
	const roomId = RoomService.getRoomIdFromUrl(window?.location?.href || "");

	const [isLoading, setIsLoading] = useState(true);
	const [broadcastedCoords, setBroadcastedCoords] = useState(null);
	const [sessionId] = useLocalStorage("sessionId");
	
	const socket = useSocketRoom();
	const [room, setRoom] = useState(null);
	const [storageProfile] = useLocalStorage<IProfile>("profile");
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		if(!socket) return;		
		socket.emit("join-room", roomId, (data) => {
			if(data === false) {
				// TODO: Redirect to homepage, because room does not exist or player is unable to join.
			}

			setIsLoading(false)
			setRoom(data);
		})

		socket.on("update-room", (data) => {
			setRoom(data);
		})
		
		socket.on("receive-message-room", (message) => {
			setMessages((prev) => [...prev, message]);
		})

		socket.on("receive-drawing", (coords) => {
			setBroadcastedCoords(coords)
		})
	}, [socket, sessionId, roomId]);
	
	const handleMessage = (e) => {
		setMessage(e.currentTarget.value);
	}

	const sendMessage = (e) => {
		e.preventDefault();
		receiveMessage({
			username: storageProfile.username,
			content: message
		})
		setMessage('');
		socket.emit("send-message-room", message, roomId);
	}

	const receiveMessage = (message) => {
		setMessages(prev => [...prev, message])
	}

	// const paperClip = (e) => {
	// 	e.preventDefault();
	// 	navigator.clipboard.writeText(url).then(function() {
	// 		// TODO: inform user that link is in his clipboard now		
	// 	});
	// }

	const emitCoords = (coords) => {
		socket.emit('send-drawing', coords, roomId);
	}

	return (
		<div>
			{isLoading ? 
				<Loading/>
			: 
			room ?
			<Layout>
					<Link href="/">
						<a><Button>&larr; Quitter le salon</Button></a>
					</Link>
					<Canvas width="800" height="400"
						emitCoords={emitCoords}
						broadcastedCoords={broadcastedCoords}
					/>
					<p className="text-white-white font-bold">utilisateurs: {JSON.stringify(room.players)}</p>
					{/* <Button onClick={paperClip}>Envoyer le lien à vos amis</Button> */}
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
			:
				<Layout>
					<Title>Ce salon n`&apos;`existe pas, veuillez reessayer: </Title>
					<Button><a href="/">Créer un salon / rejoindre un salon</a></Button>
				</Layout> 
			}
		</div>
	)
}

export default Room;