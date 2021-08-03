import { useEffect, useState } from 'react';
import useLocalStorage from './useLocalStorage';
import io from "socket.io-client";

const socket = io({ autoConnect: false});

interface IUseSocket {
    callback?: (s: SocketIOClient.Socket) => void;
}

export default function useSocket(props?: IUseSocket): SocketIOClient.Socket {
	const [sessionID, setSessionId] = useLocalStorage('sessionID');
	const [activeSocket, setActiveSocket] = useState<SocketIOClient.Socket>(
		io(
			{
				autoConnect: false,
				auth: {
					sessionID: sessionID
				}
			}
		));	

    useEffect(() => {

        // console.debug("Socket updated", { socket, activeSocket });
        if (activeSocket || !socket) return;

        props.callback && props.callback(socket);
        setActiveSocket(socket);

        /**
         * Cleanup of all socket handlers
         */
        return function cleanup() {
            // debug("Running useSocket cleanup", { socket });
			socket.close()
        };
    }, [activeSocket, props]);

    return activeSocket;
}