import { useEffect, useState } from 'react';
import useLocalStorage from './useLocalStorage';
import io from "socket.io-client";

interface IUseSocket {
    namespace?: string,
}

export default function useSocket({namespace}: IUseSocket = {}): SocketIOClient.Socket {
	const [sessionId, setSessionId] = useLocalStorage('sessionId');
	const [playerId, setPlayerId] = useLocalStorage('playerId');
	const [activeSocket, setActiveSocket] = useState<SocketIOClient.Socket>();	

    useEffect(() => {
        if(typeof window === "undefined") return;

        if(!setActiveSocket) return;
        
        const newSocket = io(
            namespace || "/",
            {
                autoConnect: true,
                auth: {
                    sessionId: sessionId,
                }
            }
        )

        newSocket.on("session", (data) => {
            setSessionId(data.sessionId)
            setPlayerId(data.playerId)
        })

        setActiveSocket(newSocket)

        if(!activeSocket) return;

        return function cleanup() {
			activeSocket.close()
        };
    }, [setActiveSocket]);

    return activeSocket;
}