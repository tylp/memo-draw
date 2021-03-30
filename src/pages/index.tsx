import React, { useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';

interface HelloMessage {
    timestamp: number;
    value: string;
}

export default function Index() {

    const socket: SocketIOClient.Socket = useSocket();
    const [value, setValue] = useState<string>("");

    useEffect(() => {
        if (socket) {
            socket.on("hello-room", (message: HelloMessage) => {
                console.log(message)
            });
        }
    }, [socket]);

    // Handle input change
    const handleInputChange = (event) => {
        setValue(event.target.value);
    };

    
    /**
     * Emit <value> to "hello-room" topic.
     * Check the server.js console to see the message.
     */ 
    function emmitData() {

        let msg: HelloMessage = {
            timestamp: new Date().getTime(),
            value: value
        }

        socket &&
            socket.emit("hello-room", msg);
    }

    return (
        <div>
            <input onChange={handleInputChange}></input>
            <button onClick={emmitData}>Send</button>
        </div>

    );
}