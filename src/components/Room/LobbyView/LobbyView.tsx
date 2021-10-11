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
import { faArrowAltCircleLeft, faArrowLeft, faChevronLeft, faChevronRight, faPlay } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Divider from "../../Common/Divider/Divider";

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
                    <SectionTitle width='w-36' hintColor="text-yellow-light-yellow">Players</SectionTitle>
					<Divider className="w-96 ml-12 mr-12 self-center"/>
                    <SmallButton className='self-center' bgColor='bg-blue-darker-blue' color='text-yellow-light-yellow' onClick={copyLinkToClipboard}
					icon={faLink}>
						INVITE
                    </SmallButton>
                </div>
				<div className="flex flex-row items-center">
					<FontAwesomeIcon className="text-white-white opacity-25" size="4x" icon={faChevronLeft}/>
					{
                        props.room?.players.map((player: Player) => (
                            <UserCard key={player.id} player={player} currentPlayer={player.id === playerId ? player : null}
							creatorId={props.room?.creatorPlayerId}
							isCreator={props.room?.creatorPlayerId === playerId}
							/>
                        ))
                    }
					<FontAwesomeIcon className="text-white-white opacity-25" size="4x" icon={faChevronRight}/>
				</div>
				<div className="self-end pl-3 pr-3 m-0 h-5 rounded-xl bg-pink-dark-pink text-sm font-rubik-bold text-white-white">{props.room?.players.length} / 10</div>
                <div className="flex flex-row align-middle">
					<SectionTitle width='w-36' hintColor="text-pink-dark-pink">Game</SectionTitle>
					<Divider className="w-96 ml-12 mr-12 self-center"/>
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