import React, { useEffect, useState } from "react";
import Player from "../../../../server/classes/Player";
import Room from "../../../../server/classes/Room";
import IProfile from "../../../../server/interfaces/IProfile";
import { useSocketRoom } from "../../../hooks";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { EnvironmentChecker } from "../../../services/EnvironmentChecker";
import RoomService from "../../../services/RoomService";
import { Layout, SectionTitle, Title } from "../../Common";
import Button from "../../Common/Button/Button";
import UserProfile from "../Id/UserProfile";

export interface LobbyViewProps {
    room: Room;
}

export function LobbyView(props: LobbyViewProps): JSX.Element {
    const socket = useSocketRoom();
    
    const [playerId] = useLocalStorage("playerId");
    
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [storageProfile] = useLocalStorage<IProfile>("profile");

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
        const messageText = message.trim();
        e.preventDefault();
        receiveMessage({
            username: storageProfile.username,
            content: messageText
        })
        
        if(messageText !== '') {
            socket.emit("send-message-room", messageText, roomId);
            setMessage('');
        }
    }
    
    const receiveMessage = (message) => {
        setMessages(prev => [...prev, message])
    }

    return (
        <Layout>
            <div className="flex flex-wrap flex-auto justify-center md:space-x-32">
                <div>
                    <SectionTitle hintColor="text-yellow-light-yellow">Players</SectionTitle>
                    {
                        props.room?.players.map((player: Player) => (
                            <UserProfile key={player.id} player={player} creatorId={props.room.creatorPlayerId}/>
                        ))
                    }
                    <Button onClick={copyLinkToClipboard}>
                        Copy link
                    </Button>
                    {
                        props.room.creatorPlayerId === playerId && (								
                    <Button onClick={startGame}>
                        Start Game
                    </Button>
                        )
                    }
                </div>
                <div>
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
}