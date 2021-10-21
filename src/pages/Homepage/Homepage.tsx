import React, { useEffect, useState } from 'react';
import IProfile, { RubberColor, BodyType, BodyColor, FaceType } from '../../../server/interfaces/IProfile';
import { Layout, LoadingFull, SectionTitle, Button, ProfileSelector } from '../../components/Common';
import { RuleItem } from '../../components/Homepage';
import { useSocket } from '../../hooks';
import useLocalStorage from '../../hooks/useLocalStorage/useLocalStorage';
import { LocalStorageKey } from '../../hooks/useLocalStorage/useLocalStorage.types';
import { useHistory } from 'react-router-dom';

import { faPlay } from '@fortawesome/free-solid-svg-icons';

import { useTranslation } from 'react-i18next';

export default function Homepage(): JSX.Element {
	const socket = useSocket();
	const history = useHistory();
	const { t } = useTranslation();

	const [isLoading, setIsLoading] = useState(true);
	const [profileStorage, setProfileStorage] = useLocalStorage<IProfile>(LocalStorageKey.Profile)
	const [profile, setProfile] = useState<IProfile>();

	useEffect(() => {
		if (socket) {
			setIsLoading(false);
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
			<Layout>
				{
					isLoading
						? (
							<LoadingFull></LoadingFull>
						)
						: (
							<div className="flex md:space-x-32">
								<div>
									<SectionTitle hintColor="text-pink-dark-pink">{t('homepage.rules.title')}</SectionTitle>
									<RuleItem id={1} title={t('homepage.rules.1.title')} content={t('homepage.rules.1.content')} />
									<RuleItem id={2} title={t('homepage.rules.2.title')} content={t('homepage.rules.2.content')} />
									<RuleItem id={3} title={t('homepage.rules.3.title')} content={t('homepage.rules.3.content')} />
								</div>
								<div>
									<SectionTitle subtitle={t('homepage.profile.subtitle')} hintColor="text-yellow-light-yellow">{t('homepage.profile.title')}</SectionTitle>
									<ProfileSelector
										profile={profile}
										setProfile={setProfile} />
									<Button className="mt-2 w-32" color='primary' size='medium' icon={faPlay} disabled={!isStartEnabled} onClick={handleStart}>{t('homepage.start')}</Button>
								</div>
							</div>
						)
				}
			</Layout>
		</div>
	);
}
