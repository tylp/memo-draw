import React, { useEffect, useState } from 'react';
import IProfile, { RubberColor, BodyType, BodyColor, FaceType } from '../../server/interfaces/IProfile';
import { Layout, SectionTitle } from '../components/Common';
import Button from '../components/Common/Button/Button';
import Loading from '../components/Common/Loading/Loading';
import { ProfileSelector } from '../components/Home';
import RuleItem from '../components/Home/RuleList/RuleItem/RuleItem';
import { useSocket } from '../hooks';
import useLocalStorage from '../hooks/useLocalStorage/useLocalStorage';
import { LocalStorageKey } from '../hooks/useLocalStorage/useLocalStorage.types';
import { useHistory } from 'react-router-dom';

export default function Homepage(): JSX.Element {
	const socket = useSocket();
	const history = useHistory();

	const [isLoading, setIsLoading] = useState(true);
	const [profileStorage, setProfileStorage] = useLocalStorage<IProfile>(LocalStorageKey.Profile)
	const [profile, setProfile] = useState<IProfile>();

	useEffect(() => {
		if (socket) {
			setIsLoading(false)
			if (profileStorage) {
				setProfile(profileStorage);
				//TODO: Redirect to correct room
			} else {
				setProfile({
					username: '',
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

	const [isStartEnabled, setIsStartEnabled] = useState(true);

	useEffect(() => {
		setIsStartEnabled(profile?.username?.length >= 3);
	}, [profile]);

	const handleStart = () => {
		socket.emit('update-profile', profile, () => {
			setProfileStorage(profile);
			handleRoomCreation();
		})
	}

	const handleRoomCreation = () => {
		socket.emit('create-room', () => {
			history.push('/lobby')
		});
	}

	return (
		<div>
			{
				isLoading
					? (
						<Loading />
					)
					: (
						<Layout>
							<div className="flex md:space-x-32">
								<div>
									<SectionTitle hintColor="text-pink-dark-pink">THE GAME</SectionTitle>
									<RuleItem id={1} title="Invite tes copaing" content="Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet..." />
									<RuleItem id={2} title="Invite tes copaing" content="Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet..." />
									<RuleItem id={3} title="Invite tes copaing" content="Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet..." />
								</div>
								<div>
									<ProfileSelector
										profile={profile}
										socket={socket}
										setProfile={setProfile} />
									<Button className="mt-2" disabled={!isStartEnabled} onClick={handleStart}>Done !</Button>
								</div>
							</div>
						</Layout>
					)
			}
		</div>
	);
}
