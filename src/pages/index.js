import React, { useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';

export default function Index() {

    const socket = useSocket();
    const [value, setValue] = useState("");

    useEffect(() => {
        if (socket) {
            socket.on("hello-room", message => {
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
        socket &&
            socket.emit("hello-room", {
                id: new Date().getTime(),
                value: value
            });
    }

    return (
        <>
            <input onChange={handleInputChange}></input>
            <button onClick={emmitData}>Send</button>
        </>

    );
}