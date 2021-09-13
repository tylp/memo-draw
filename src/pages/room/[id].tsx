import React, { useEffect, useState } from 'react';
import { useSocketRoom} from '../../hooks';
import { Layout, Title } from '../../components/Common';
import Button from '../../components/Common/Button/Button';
import Loading from '../../components/Common/Loading/Loading';
import useLocalStorage from '../../hooks/useLocalStorage';
import RoomService from '../../services/RoomService';
import RoomType from '../../../server/classes/Room';
import { Game } from '../../../server/classes/Game';
import { LobbyView } from '../../components/Room/LobbyView/LobbyView';
import { GameView } from '../../components/Room/GameView/GameView';

const Room = (): JSX.Element => {
    const getRoomId = (): string => {
        if(typeof window !== "undefined") {
            return RoomService.getRoomIdFromUrl(window.location.href)
        }
        return "";
    }
    
    const roomId = getRoomId();
    
    const [isLoading, setIsLoading] = useState(true);
    const [sessionId] = useLocalStorage("sessionId");
    
    const socket = useSocketRoom();
    const [room, setRoom] = useState<RoomType>();
    const [game, setGame] = useState<Game>();
    
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

        socket.on("game-started", (room, game) => {
            setRoom(room);
            setGame(game);
        })
    }, [socket, sessionId, roomId]);
    
    return isLoading ? (
        <Loading/>
    )
        :
        room ? (
            <RoomOrGame room={room} game={game}></RoomOrGame>
        )
        : (
            <Layout>
                <Title>Ce salon n`&apos;`existe pas, veuillez reessayer: </Title>
                <Button><a href="/">Créer un salon / rejoindre un salon</a></Button>
            </Layout> 
        )
}			
export default Room;

function RoomOrGame(props: {room: RoomType; game: Game}) {
    return props.room?.hasStarted ? (
        <GameView game={props.game}/>
    ) : (
        <LobbyView room={props.room}/>
    )
}