import React, { Dispatch, SetStateAction } from 'react';
import { Title } from '..';
import Button from '../Button/Button';
import Avatar from '../Avatar/Avatar';
import { faRandom } from '@fortawesome/free-solid-svg-icons';
import IProfile, { RubberColor, BodyColor, FaceType } from '../../../../server/interfaces/IProfile';
import { useTranslation } from 'react-i18next';
import AvatarFactory from '../../../../server/factories/AvatarFactory';
import SelectButton from './SelectButton/SelectButton';
import Box from '../Box/Box';

interface ProfileSelectorSpec {
	profile: IProfile;
	setProfile: Dispatch<SetStateAction<IProfile>>;
}

export default function ProfileSelector(props: ProfileSelectorSpec): JSX.Element {
	const { t } = useTranslation();

	const faceTypes = Object.values(FaceType);
	const bodyColors = Object.values(BodyColor);
	const rubberColors = Object.values(RubberColor);

	const randomizeAvatar = () => {
		props.setProfile({
			username: props.profile.username,
			avatar: AvatarFactory.create()
		});
	}

	const setUsername = (username: string) => props.setProfile({ ...props.profile, username })
	const setRubberColor = (rubberColor: RubberColor) => props.setProfile({ ...props.profile, ...{ avatar: { ...props.profile.avatar, rubberColor } } })
	const setBodyColor = (bodyColor: BodyColor) => props.setProfile({ ...props.profile, ...{ avatar: { ...props.profile.avatar, bodyColor } } })
	const setFaceType = (faceType: FaceType) => props.setProfile({ ...props.profile, ...{ avatar: { ...props.profile.avatar, faceType } } })

	return (
		<div>
			<div className="bg-blue-darker-blue rounded-md p-4 pt-2">
				<Title>{t('profileSelector.title')}</Title>
				<div className="mt-4 grid grid-cols-3 grid-flow-col auto-cols-min">
					<div className="flexflex-col justify-between">
						<SelectButton<RubberColor> direction="left" name={t('profileSelector.eraser')} value={props.profile.avatar.rubberColor} list={rubberColors} setValue={(v) => setRubberColor(v)} />
						<SelectButton<BodyColor> direction="left" name={t('profileSelector.color')} value={props.profile.avatar.bodyColor} list={bodyColors} setValue={(v) => setBodyColor(v)} />
						<SelectButton<FaceType> direction="left" name={t('profileSelector.face')} value={props.profile.avatar.faceType} list={faceTypes} setValue={(v) => setFaceType(v)} />
					</div>

					<div className="flex items-center">
						<Avatar avatar={props.profile.avatar} />
					</div>

					<div className="flex flex-col justify-between">
						<SelectButton<RubberColor> direction="right" name={t('profileSelector.eraser')} value={props.profile.avatar.rubberColor} list={rubberColors} setValue={(v) => setRubberColor(v)} />
						<SelectButton<BodyColor> direction="right" name={t('profileSelector.color')} value={props.profile.avatar.bodyColor} list={bodyColors} setValue={(v) => setBodyColor(v)} />
						<SelectButton<FaceType> direction="right" name={t('profileSelector.face')} value={props.profile.avatar.faceType} list={faceTypes} setValue={(v) => setFaceType(v)} />
					</div>
				</div>

				<Box mt={2}>
					<Button fullWidth color='primary' size='medium' icon={faRandom} onClick={randomizeAvatar}>{t('profileSelector.randomize')}</Button>
					<Title>{t('profileSelector.nickname')}</Title>
					<input className="bg-blue-200 w-full border-2 rounded border-yellow-light-yellow pl-2 text-white-white" type="text" value={props.profile.username} onChange={(e) => setUsername(e.target.value)} />
				</Box>
			</div>
		</div>
	)

}
