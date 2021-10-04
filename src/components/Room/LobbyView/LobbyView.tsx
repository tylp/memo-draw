import React, { useEffect, useState } from "react";
import Player from "../../../../server/classes/Player";
import Room from "../../../../server/classes/Room";
import IProfile from "../../../../server/interfaces/IProfile";
import { useSocketRoom } from "../../../hooks";
import useLocalStorage from "../../../hooks/useLocalStorage/useLocalStorage";
import { LocalStorageKey } from "../../../hooks/useLocalStorage/useLocalStorage.types";
import { EnvironmentChecker } from "../../../services/EnvironmentChecker";
import RoomService from "../../../services/RoomService";
import { Layout, SectionTitle, Title } from "../../Common";
import SmallButton from "../../Common/SmallButton/SmallButton";
import UserCard from "./UserCard";
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';

export interface LobbyViewProps {
    room: Room;
}

export function LobbyView(props: LobbyViewProps): JSX.Element {
    const socket = useSocketRoom();
    
    const [playerId] = useLocalStorage(LocalStorageKey.PlayerId);
    
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [storageProfile] = useLocalStorage<IProfile>(LocalStorageKey.Profile);

    const getRoomId = (): string => {
        if(EnvironmentChecker.isClientSide()) {
            return RoomService.getRoomIdFromUrl(window.location.href)
        }
        return undefined;
    }
    
    const roomId = getRoomId();

    useEffect(() => {
        if(!socket) {
            return;
        }
        
        socket.on("receive-message-room", (message) => {
            setMessages((prev) => [...prev, message]);
        })
    }, [socket])

    const copyLinkToClipboard = () => {
        if(EnvironmentChecker.isClientSide()) {
            navigator.clipboard.writeText(window.location.href)
        }
    }

    const startGame = () => {
        if(props.room.creatorPlayerId === playerId) {
            socket.emit('start-game');
        }
    }

    const handleMessage = (e) => {
        setMessage(e.currentTarget.value);
    }
    
    const sendMessage = (e) => {
        e.preventDefault();
        const messageText = message.trim();
        
        if(messageText.length > 0) {
            receiveMessage({
                username: storageProfile.username,
                content: messageText
            })

            socket.emit("send-message-room", messageText, roomId);
            setMessage('');
        }
    }
    
    const receiveMessage = (message) => {
        setMessages(prev => [...prev, message])
    }

    return (
        <Layout>
            <div className="flex flex-col justify-center">
                <div className="flex flex-row justify-center align-middle">
                    <SectionTitle width='w-24' hintColor="text-yellow-light-yellow">Players</SectionTitle>
					<div className="border-t-4 border-opacity-25 w-96 ml-12 mr-12 self-center border-white-white rounded-md"/>
                    <SmallButton className='self-center' bgColor='bg-blue-darker-blue' color='text-yellow-light-yellow' onClick={copyLinkToClipboard}
					icon={faLink}>
						INVITE
                        {/* Copy link {props.room.creatorPlayerId} */}
                    </SmallButton>
                </div>
				<div className="flex flex-row">
					{
                        props.room?.players.map((player: Player) => (
                            <UserCard key={player.id} player={player} 
							// creatorId={props.room.creatorPlayerId}
							/>
                        ))
                    }
				</div>
                <div className="flex flex-row align-middle">
                    {/* <Title>Messages du salon :</Title>
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
                    </div> */}
					<SectionTitle width='w-24' hintColor="text-pink-dark-pink">Game</SectionTitle>
					<div className="border-t-4 border-opacity-25 w-96 ml-12 mr-12 self-center border-white-white rounded-md"/>
					{
						props.room.creatorPlayerId === playerId && (			
						<SmallButton
						className='self-center' color='text-white-white' bgColor='bg-pink-dark-pink' onClick={startGame}
						icon={faPlay}>
							Start
						</SmallButton>
						)
					}
				</div>
            </div>
        </Layout>
    )
}