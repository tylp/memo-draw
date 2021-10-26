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
import Box from '../../components/Common/Box/Box';
import { Row, Col } from 'react-grid-system';

export default function Homepage(): JSX.Element {
	const socket = useSocket();
	const history = useHistory();
	const { t } = useTranslation();

	const [isLoading, setIsLoading] = useState(true);
	const [isCheckingForRoom, setIsCheckingForRoom] = useState(true);
	const [profileStorage, setProfileStorage] = useLocalStorage<IProfile>(LocalStorageKey.Profile)
	const [profile, setProfile] = useState<IProfile>();

	const [isStartEnabled, setIsStartEnabled] = useState(true);

	useEffect(() => {
		if (socket) {
			socket.emit('check-already-in-room', (hasLobby) => {
				if (hasLobby) {
					history.push('/lobby');
				} else {
					setIsCheckingForRoom(false);
				}
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	useEffect(() => {
		if (socket) {
			setIsLoading(false);
			if (profileStorage) {
				setProfile(profileStorage);
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

	return (isLoading || isCheckingForRoom) ?
		(
			<LoadingFull />
		) : (
			<Layout>
				<Row>
					<Col>
						<Row>
							<Col offset={{ md: 1 }}>
								<Row>
									<Col>
										<SectionTitle hintColor="text-pink-dark-pink">{t('homepage.rules.title')}</SectionTitle>
										<Box mb={2}>
											<RuleItem id={1} title={t('homepage.rules.1.title')} content={t('homepage.rules.1.content')} />
										</Box>
										<Box mb={2}>
											<RuleItem id={2} title={t('homepage.rules.2.title')} content={t('homepage.rules.2.content')} />
										</Box>
										<Box>
											<RuleItem id={3} title={t('homepage.rules.3.title')} content={t('homepage.rules.3.content')} />
										</Box>
									</Col>
								</Row>
							</Col>
							<Col offset={{ md: 1 }}>
								<SectionTitle subtitle={t('homepage.profile.subtitle')} hintColor="text-yellow-light-yellow">{t('homepage.profile.title')}</SectionTitle>
								<ProfileSelector
									profile={profile}
									setProfile={setProfile}
									setIsUsernameValid={setIsStartEnabled}
								/>
								<Box mt={2}>
									<Button fullWidth color='primary' size='medium' icon={faPlay} disabled={!isStartEnabled} onClick={handleStart}>{t('homepage.start')}</Button>
								</Box>
							</Col>
							<Col md={1}></Col>
						</Row>
					</Col>
				</Row>
			</Layout>
		)
}
