import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {Layout, Title} from "./Common";
import Button from "./Common/Button/Button";

export default function RoomSelector(props) {
    // const usersList = props.users;
    // const roomsList = props.rooms;
	const socket = props.socket;
    const [usersList, setUsersList] = useState([]);
    const [roomsList, setRoomsList] = useState([]);

	//executed when component is created (one time)
    useEffect(() => {
		socket.on("session", ({ sessionID, userID }) => {
			console.log('resetting session');
			
			// attach the session ID to the next reconnection attempts
			socket.auth = { sessionID };
			// store it in the localStorage
			localStorage.setItem("sessionID", sessionID);
			// save the ID of the user
			socket.userID = userID;
		});

		socket.on("user connected", (newUser) => {
			console.log('another user is connected');
			newUser.connected = true;
			let userRegistered = false;
			setUsersList((prevList) => prevList.map((user) => {
				if (user.userID === newUser.userID) {
					user.connected = true;
					userRegistered = true;
					console.log('user reconnection');
					
					return user
				}
				return user
			}));
			if(!userRegistered)
				setUsersList((prevList) => [...prevList, newUser]);
		});

		socket.on("connect", () => {
            console.log('connect');
            setUsersList((prevList) => prevList.map((user) => {
                if (user.self) {
                    user.connected = true;
                    return user
                }
                return user
            }));
        });

		socket.on("disconnect", () => {
			console.log('user disconnected');
			setUsersList((prevList) => prevList.map((user) => {
				if (user.self) {
					user.connected = false;
					return user
				}
				return user
			}));
		});
	
		socket.on("user disconnected", (id) => {
			setUsersList((prevList) => prevList.map((user) => {
				if (user.userID === id) {
					user.connected = false;
					return user
				}
				return user
			}));
		});

		socket.on("users", (users) => {
			// let tmpUsersList = [];
			users.forEach((user) => {
				for (let i = 0; i < usersList.length; i++) {
					const existingUser = usersList[i];
					if (existingUser.userID === user.userID) {
					existingUser.connected = user.connected;
					return;
					}
				}
				user.self = user.userID === socket.userID;
				// user.connected = true;
			});
			// put the current user first, and sort by username
			users = users.sort((a, b) => {
				if (a.self) return -1;
				if (b.self) return 1;
				if (a.username < b.username) return -1;
				return a.username > b.username ? 1 : 0;
			});
			setUsersList(users);
			console.log('client users event');
			
		});

		socket.on("rooms", (rooms) => {
			setRoomsList(rooms);
		});

		socket.on("new-room", (room) => {
			setRoomsList((rooms) => [...rooms, room]);
			console.log(roomsList);
			
		})

		socket.on("add-nb-player", (roomID) => {
			setRoomsList((prevList) => prevList.map((room) => {
				if(room.id === roomID){
					room.nbPlayer++
					return room;
				}
				return room
			}));
		});

		socket.on("sub-nb-player", (roomID) => {
			setRoomsList((prevList) => prevList.map((room) => {
				if(room.id === roomID){
					room.nbPlayer--
					return room;
				}
				return room
			}));
		});

		//executed when component is dismounted (one time)
		return () => {
			// console.log('client off');
			// socket.off("connect_error");
			// socket.off("connect");
			// socket.off("disconnect");
			// socket.off("user connected");
			// socket.off("user disconnected");
			// socket.off("users");
			// socket.off("manual-disconnect");
			// socket.close();
		}
	}, []);

    function status(connected) {
        if(connected){
            return <span style={{color: 'green', fontWeight: 'bold'}}>●</span>
        }
        return <span style={{color: 'red', fontWeight: 'bold'}}>●</span>
    }


    const usersArray = () => {
        if(usersList.length !== 0) {
            return usersList.map((user, id) => {
                return(
                    <li className="text-md text-white-white" key={id}>{user.username} {user.self ? "(me)" : ""} {status(user.connected)}</li>
                )
            });
        }
        return (<li className="text-md text-white-white">Aucun utilisateur connecté</li>)
    }
	
	return (
        <Layout>
            <div className="md:flex">
                <div className="bg-blue-darker-blue rounded-md p-6 pt-2 w-100 md:max-w-xs lg:w-100 xl:w-100 2xl:w-100">
                    <div className="mt-4">
						<div>
							<Title>Utilisateurs connectés:</Title>
							<ul className="ml-4 list-disc">
								{usersArray()}
							</ul>
							<Button className="mt-2" onClick={() => props.onHandleRoomCreation()}>Creer un salon</Button><br/>
							<Button className="mt-2" onClick={() => props.onHandleDisconnect()}>Se deconnecter</Button>
                    	</div>
                    </div>
                </div>
                <div className="m-4 bg-blue-darker-blue rounded-md p-6 pt-2 w-100 md:max-w-xs lg:w-100 xl:w-100 2xl:w-100">
                    <Title>Rejoindre un salon:</Title>
                    <ul className="ml-4 list-disc">
                        { roomsList.map((room, key) => (
                        <li className="text-md text-white-white" key={key}><Link href={'/room/'+room.id}><a>{room.name} {`(${room.nbPlayer} joueurs)`}</a></Link></li>
                        )) }
                    </ul>
                </div>
            </div>
        </Layout>
    );
}