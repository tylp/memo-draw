import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Title } from '..';
import Avatar from '../Avatar/Avatar';
import IProfile, { RubberColor, BodyColor, FaceType } from '../../../../server/interfaces/IProfile';
import { useTranslation } from 'react-i18next';
import AvatarFactory from '../../../../server/factories/AvatarFactory';
import SelectButton from './SelectButton/SelectButton';
import Box from '../Box/Box';
import ProfileValidatorService from '../../../../server/services/ProfileValidatorService';
import { faRandom } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ProfileSelectorSpec {
	profile: IProfile;
	setProfile: Dispatch<SetStateAction<IProfile>>;
	setIsProfileValid: Dispatch<SetStateAction<boolean>>;
	onEnter?: () => void;
}

export default function ProfileSelector(props: ProfileSelectorSpec): JSX.Element {
	const { t } = useTranslation();

	const faceTypes = Object.values(FaceType);
	const bodyColors = Object.values(BodyColor);
	const rubberColors = Object.values(RubberColor);

	const randomizeAvatar = () => {
		props.setProfile({
			username: props.profile.username,
			avatar: AvatarFactory.create(),
		});
	}

	useEffect(() => {
		props.setIsProfileValid(ProfileValidatorService.validate({ ...props.profile }));
	}, [props])

	const setUsername = (username: string) => {
		props.setProfile({ ...props.profile, username })
	}

	const handleOnKeyUp = (element) => {
		if (element.key === 'Enter') {
			props?.onEnter();
		}
	}

	const setRubberColor = (rubberColor: RubberColor) => props.setProfile({ ...props.profile, ...{ avatar: { ...props.profile.avatar, rubberColor } } })
	const setBodyColor = (bodyColor: BodyColor) => props.setProfile({ ...props.profile, ...{ avatar: { ...props.profile.avatar, bodyColor } } })
	const setFaceType = (faceType: FaceType) => props.setProfile({ ...props.profile, ...{ avatar: { ...props.profile.avatar, faceType } } })

	return (
		<div>
			<div className="bg-blue-darker-blue rounded-md p-4 pt-2">
				<Title>{t('profileSelector.title')}</Title>
				<div className=" flex items-center mb-7">
					<div className="flex flex-col justify-between">
						<SelectButton<RubberColor> direction="left" name={t('profileSelector.eraser')} value={props.profile.avatar.rubberColor} list={rubberColors} setValue={(v) => setRubberColor(v)} />
						<SelectButton<BodyColor> direction="left" name={t('profileSelector.color')} value={props.profile.avatar.bodyColor} list={bodyColors} setValue={(v) => setBodyColor(v)} />
						<SelectButton<FaceType> direction="left" name={t('profileSelector.face')} value={props.profile.avatar.faceType} list={faceTypes} setValue={(v) => setFaceType(v)} />
					</div>

					<div style={{ maxHeight: '190px', maxWidth: '190px' }} className="flex flex-grow mx-auto px-4 relative">
						<div style={{ position: 'absolute', right: 20, bottom: 0, zIndex: 1 }}>
							<button
								onClick={randomizeAvatar}
								style={{
									border: 'none',
									height: '40px',
									width: '40px',
									borderRadius: '50%',
									color: 'white',
								}}
								className="bg-pink-dark-pink">
								<FontAwesomeIcon icon={faRandom} />
							</button>
						</div>
						<Avatar avatar={props.profile.avatar} />
					</div>

					<div className="flex flex-col justify-between">
						<SelectButton<RubberColor> direction="right" name={t('profileSelector.eraser')} value={props.profile.avatar.rubberColor} list={rubberColors} setValue={(v) => setRubberColor(v)} />
						<SelectButton<BodyColor> direction="right" name={t('profileSelector.color')} value={props.profile.avatar.bodyColor} list={bodyColors} setValue={(v) => setBodyColor(v)} />
						<SelectButton<FaceType> direction="right" name={t('profileSelector.face')} value={props.profile.avatar.faceType} list={faceTypes} setValue={(v) => setFaceType(v)} />
					</div>
				</div>

				<Box mt={6}>
					<Title>{t('profileSelector.nickname')}</Title>
					<input
						className="bg-blue-200 w-full border-2 rounded border-yellow-light-yellow pl-2 text-white-white"
						type="text"
						value={props.profile.username}
						onChange={(e) => setUsername(e.target.value)}
						onKeyUp={handleOnKeyUp}
					/>
				</Box>
			</div>
		</div>
	)

}
