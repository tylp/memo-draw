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
import SocketEventEmitter from '../../services/SocketEventEmitter';

export default function Homepage(): JSX.Element {
	const socket = useSocket();
	const history = useHistory();
	const { t } = useTranslation();

	const [isLoading, setIsLoading] = useState(true);
	const [isCheckingForLobby, setIsCheckingForLobby] = useState(true);
	const [profileStorage, setProfileStorage] = useLocalStorage<IProfile>(LocalStorageKey.Profile)
	const [profile, setProfile] = useState<IProfile>();
	const [isStartEnabled, setIsStartEnabled] = useState(true);

	useEffect(() => {
		if (!socket) return;
		SocketEventEmitter.checkAlreadyInLobby(socket, (hasLobby: boolean) => {
			if (hasLobby) {
				history.push('/game');
			} else {
				setIsCheckingForLobby(false);
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket])

	useEffect(() => {
		if (!socket) return;
		setIsLoading(false);
		if (profileStorage) {
			setProfile(profileStorage);
			return;
		}
		setProfile({
			username: '',
			avatar: {
				bodyColor: BodyColor.Yellow,
				bodyType: BodyType.Pencil,
				faceType: FaceType.Happy,
				rubberColor: RubberColor.Pink,
			},
		})
	}, [socket, profileStorage]);

	const handleStart = () => {
		SocketEventEmitter.updateProfile(socket, profile, () => {
			setProfileStorage(profile);
			handleLobbyCreation();
		});
	}

	const handleLobbyCreation = () => {
		SocketEventEmitter.createLobby(socket, () => {
			history.push('/game')
		});
	}

	return (isLoading || isCheckingForLobby) ?
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
										<Box mt={6} mb={6}>
											<SectionTitle hintColor="text-pink-dark-pink">{t('homepage.rules.title')}</SectionTitle>
										</Box>
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
								<Box mt={6} mb={6}>
									<SectionTitle subtitle={t('homepage.profile.subtitle')} hintColor="text-yellow-light-yellow">{t('homepage.profile.title')}</SectionTitle>
								</Box>
								<ProfileSelector
									profile={profile}
									setProfile={setProfile}
									setIsProfileValid={setIsStartEnabled}
									onEnter={handleStart}
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
