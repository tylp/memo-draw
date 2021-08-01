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

        console.log('sessionID: ', sessionID);

        if (sessionID) {
            console.log('in rooms déjà connecté !');
            
            socket.auth = { sessionID };
            socket.connect();
        }
        
        // socket.on("session", ({ sessionID, userID }) => {
        //     console.log('resetting session');
            
        //     // attach the session ID to the next reconnection attempts
        //     socket.auth = { sessionID };
        //     // store it in the localStorage
        //     localStorage.setItem("sessionID", sessionID);
        //     // save the ID of the user
        //     socket.userID = userID;
        //   });

        // socket.on("user connected", (newUser) => {
        //     console.log('another user is connected');
        //     newUser.connected = true;
        //     let userRegistered = false;
        //     setUsersList((prevList) => prevList.map((user) => {
        //         if (user.userID === newUser.userID) {
        //             user.connected = true;
        //             userRegistered = true;
        //             console.log('user reconnection');
                    
        //             return user
        //         }
        //         return user
        //     }));
        //     if(!userRegistered)
        //         setUsersList((prevList) => [...prevList, newUser]);
        // });

        socket.on("connect_error", (err) => {
            if (err.message === "invalid username") {
                setUsernameAlreadySelected(false);
            }
        });

        socket.on("connect", () => {
            console.log('connect');
            setUsernameAlreadySelected(true);
            // setUsersList((prevList) => prevList.map((user) => {
            //     if (user.self) {
            //         user.connected = true;
            //         return user
            //     }
            //     return user
            // }));
        });

        // socket.on("disconnect", () => {
        //     console.log('user disconnected');
        //     setUsersList((prevList) => prevList.map((user) => {
        //         if (user.self) {
        //             user.connected = false;
        //             return user
        //         }
        //         return user
        //     }));
        // });
      
        // socket.on("user disconnected", (id) => {
        //     setUsersList((prevList) => prevList.map((user) => {
        //         if (user.userID === id) {
        //             user.connected = false;
        //             return user
        //         }
        //         return user
        //     }));
        // });

        // socket.on("users", (users) => {
        //     // let tmpUsersList = [];
        //     users.forEach((user) => {
        //         for (let i = 0; i < usersList.length; i++) {
        //             const existingUser = usersList[i];
        //             if (existingUser.userID === user.userID) {
        //               existingUser.connected = user.connected;
        //               return;
        //             }
        //         }
        //         user.self = user.userID === socket.userID;
        //         // user.connected = true;
        //     });
        //     // put the current user first, and sort by username
        //     users = users.sort((a, b) => {
        //         if (a.self) return -1;
        //         if (b.self) return 1;
        //         if (a.username < b.username) return -1;
        //         return a.username > b.username ? 1 : 0;
        //     });
        //     setUsersList(users);
        //     console.log('client users event');
            
        // });

        // socket.on("rooms", (rooms) => {
        //     setRoomsList(rooms);
        // });

        // socket.on("new-room", (room) => {
        //     setRoomsList((rooms) => [...rooms, room]);
        //     console.log(roomsList);
            
        // })

        // socket.on("add-nb-player", (roomID) => {
        //     setRoomsList((prevList) => prevList.map((room) => {
        //         if(room.id === roomID){
        //             room.nbPlayer++
        //             return room;
        //         }
        //         return room
        //     }));
        // });

        // socket.on("sub-nb-player", (roomID) => {
        //     setRoomsList((prevList) => prevList.map((room) => {
        //         if(room.id === roomID){
        //             room.nbPlayer--
        //             return room;
        //         }
        //         return room
        //     }));
        // });

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
		console.log('trigger');
		
		setUsernameAlreadySelected(isSelected);
	}

    // Handle user name
    const handleUsername = (e) => {
        setUsername(e.currentTarget.value);
    }

    const submitUsername = () => {
        console.log(username);
        
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
        console.log('create-room');
	}

    // function status(connected) {
    //     if(connected){
    //         return <span style={{color: 'green', fontWeight: 'bold'}}>●</span>
    //     }
    //     return <span style={{color: 'red', fontWeight: 'bold'}}>●</span>
    // }


    // const usersArray = () => {
    //     if(usersList.length !== 0) {
    //         return usersList.map((user, id) => {
    //             return(
    //                 <li className="text-md text-white-white" key={id}>{user.username} {user.self ? "(me)" : ""} {status(user.connected)}</li>
    //             )
    //         });
    //     }
    //     return (<li className="text-md text-white-white">Aucun utilisateur connecté</li>)
    // }

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
					// users={usersList}
					// rooms={roomsList}
					onHandleRoomCreation={handleRoomCreation}
					onHandleDisconnect={handleDisconnect}
				/>
			}
		</div>
    );
}