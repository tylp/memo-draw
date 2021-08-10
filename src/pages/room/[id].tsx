import React, { useEffect, useState } from 'react';
import { useSocketRoom} from '../../hooks';
import { Layout, SectionTitle, Title } from '../../components/Common';
import Button from '../../components/Common/Button/Button';
import Loading from '../../components/Common/Loading/Loading';
import Canvas from '../../components/Canvas';
import useLocalStorage from '../../hooks/useLocalStorage';
import RoomService from '../../services/RoomService';
import IProfile from '../../../server/interfaces/IProfile';
import Player from '../../../server/classes/Player';
import UserProfile from '../../components/Room/Id/UserProfile';
import Logo from '../../components/Common/Logo/Logo';

const Room = (): JSX.Element => {
	
	const getRoomId = (): string => {
		if(typeof window !== "undefined") {
			return RoomService.getRoomIdFromUrl(window.location.href)
		}
		return "";
	}
	
	const roomId = getRoomId();
	
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
		
		if(message !== '') {
			socket.emit("send-message-room", message, roomId);
			setMessage('');
		}
	}
	
	const receiveMessage = (message) => {
		setMessages(prev => [...prev, message])
	}
	
	const copyLinkToClipboard = () => {
		if(typeof window !== "undefined") {
			navigator.clipboard.writeText(window.location.href)
		}
	}
	
	const emitCoords = (coords) => {
		socket.emit('send-drawing', coords, roomId);
	}
	
	return isLoading ? 
		<Loading/>
		:
		room ? (
			<Layout>
				<div className="flex-row">
					<Logo/>
				</div>
				<div className="flex flex-wrap flex-auto justify-center md:space-x-14">
					<div>
						<SectionTitle hintColor="text-yellow-light-yellow">Players</SectionTitle>
						{
							room?.players.map((player: Player) => <UserProfile key={player.id} player={player}/>)
						}
						<Button onClick={copyLinkToClipboard}>
							Copy link
						</Button>
					</div>
					<div>
						<Canvas width="800" height="400"
						emitCoords={emitCoords}
						broadcastedCoords={broadcastedCoords}
						/>
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
						</div>
						<div>
							<SectionTitle hintColor="text-pink-dark-pink">Game</SectionTitle>
						</div>
				</div>
			</Layout>
		)
		: (
			<Layout>
				<Title>Ce salon n`&apos;`existe pas, veuillez reessayer: </Title>
				<Button><a href="/">Créer un salon / rejoindre un salon</a></Button>
			</Layout> 
		)
}			
export default Room;