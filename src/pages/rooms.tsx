import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {useSocket} from '../hooks';
import {Layout, Title} from "../components/Common";
import Button from "../components/Common/Button/Button";
import Connection from '../components/Connection';
import RoomSelector from '../components/RoomSelector';

export default function Rooms(){
    const socket = useSocket();
    const [username, setUsername] = useState<string>("");
    const [usernameAlreadySelected, setUsernameAlreadySelected] = useState<boolean>(false);

    //executed when component is updated (multiple time)
    useEffect(() => {
        // console.log('usersList: ', usersList);
    });

    //executed when component is created (one time)
    useEffect(() => {
        const sessionID = localStorage.getItem("sessionID");
        if (sessionID) {
            socket.auth = { sessionID };
            socket.connect();
        }

        socket.on("connect_error", (err) => {
            if (err.message === "invalid username") {
                setUsernameAlreadySelected(false);
            }
        });

        socket.on("connect", () => {
            console.log('connect');
            setUsernameAlreadySelected(true);
        });

        //executed when component is dismounted (one time)
        return () => {
            console.log('client off');
            socket.off("connect_error");
            socket.off("connect");
            socket.off("disconnect");
            socket.off("user connected");
            socket.off("user disconnected");
            socket.off("users");
            socket.off("manual-disconnect");
            socket.close();
        }
    }, []);

	const usernameSelected = (isSelected) => {
		setUsernameAlreadySelected(isSelected);
	}

    // Handle user name
    const handleUsername = (e) => {
        setUsername(e.currentTarget.value);
    }

    const submitUsername = () => {
        setUsernameAlreadySelected(true);
        socket.auth = { username };
        socket.connect();
    }

	const clearStorage = (e) => {
        e.preventDefault();
        localStorage.clear();
	}

    const handleDisconnect = () => {
        localStorage.clear();
        setUsernameAlreadySelected(false);
		socket.emit('manual-disconnect', 'manual disconnect');
        socket.disconnect();
	}

    const handleRoomCreation = () => {
		socket.emit('create-room', socket.userID);
	}

    return (
		<div>
			{!usernameAlreadySelected ?
				<Connection
					socket={socket}
					username={username}
					onUsernameSelected={usernameSelected}
					onHandleUsername={handleUsername}
					onSubmitUsername={submitUsername}
					onClearStorage={clearStorage}
				/>
			: 
				<RoomSelector
					socket={socket}
					onHandleRoomCreation={handleRoomCreation}
					onHandleDisconnect={handleDisconnect}
				/>
			}
		</div>
    );
}