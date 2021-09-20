import React, { useEffect, useState } from 'react';
import IProfile, { RubberColor, BodyType, BodyColor, FaceType } from '../../server/interfaces/IProfile';
import {Layout, SectionTitle} from "../components/Common";
import Loading from '../components/Common/Loading/Loading';
import {ProfileSelector} from "../components/Home";
import RuleItem from '../components/Home/RuleList/RuleItem/RuleItem';
import { useSocket } from '../hooks';
import useLocalStorage from '../hooks/useLocalStorage/useLocalStorage';
import { LocalStorageKey } from '../hooks/useLocalStorage/useLocalStorage.types';

export default function Index(): JSX.Element {
	const socket = useSocket();
	const [isLoading, setIsLoading] = useState(true);
	const [profileStorage, setProfileStorage] = useLocalStorage<IProfile>(LocalStorageKey.Profile)
	const [profile, setProfile] = useState<IProfile>();

	useEffect(() => {
		if(socket) {
			setIsLoading(false)
			if(profileStorage) {
				console.log("fromStorage", profileStorage)
				setProfile(profileStorage);
				//TODO: Redirect to correct room
			} else {
				console.log("fromNone")
				setProfile({
					username: "",
					avatar: {
						bodyColor: BodyColor.Yellow,
						bodyType: BodyType.Pencil,
						faceType: FaceType.Happy,
						rubberColor: RubberColor.Pink
					}
				})
			}
		}
	}, [socket, profileStorage]);

	const handleStart = () => {
		socket.emit("update-profile", profile, () => {
			setProfileStorage(profile);
			handleRoomCreation();
		})
	}

	const handleRoomCreation = () => {
		socket.emit('create-room', (room) => {
			document.location.href = `/room/${room.id}`
		});
	}

	return (
		<div>
			{
			isLoading
			? (
				<Loading/>
			) 
			: (
				<Layout>
					<div className="flex flex-wrap flex-auto justify-center md:space-x-32">
						<div>
							<SectionTitle hintColor="text-pink-dark-pink">THE GAME</SectionTitle>
							<RuleItem id={1} title="Invite tes copaing" content="Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet..."/>
							<RuleItem id={2} title="Invite tes copaing" content="Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet..."/>
							<RuleItem id={3} title="Invite tes copaing" content="Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet..."/>
						</div>
						<div>
							<ProfileSelector 
							handleStart={handleStart}
							profile={profile}
							setProfile={setProfile}/>
						</div>
					</div>
				</Layout>
			)
			}
		</div>
	);
}
