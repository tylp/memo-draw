import React, { useEffect, useState } from 'react';

import AvatarService from '../../../services/AvatarService';
import IdGeneratorService from '../../../../server/services/IdGeneratorService';

import { AvatarSpecs, IBody, IFace } from './Avatar.spec';

export default function Avatar(props: AvatarSpecs): JSX.Element {

	const [avatarId] = useState(IdGeneratorService.generate());

	const updateColor = (elementToUpdate: string, value) => {
		const avatarElement = document.getElementById(avatarId) as HTMLObjectElement;
		if (typeof document !== 'undefined' && avatarElement && avatarElement.contentDocument) {
			const paintableElement = avatarElement.contentDocument.getElementById(elementToUpdate);
			if (paintableElement)
				paintableElement.style.fill = value;
		}
	}

	useEffect(() => {
		const arm = document.getElementById(avatarId);
		arm.addEventListener('load', function () {
			updateColor('eraser-paint', props.avatar.rubberColor);
			updateColor('avatar-body-paint', props.avatar.bodyColor);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		updateColor('eraser-paint', props.avatar.rubberColor);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.avatar.rubberColor]);

	useEffect(() => {
		updateColor('avatar-body-paint', props.avatar.bodyColor);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.avatar.bodyColor]);

	return (
		<div className="w-full rounded-full border-4 border-yellow-light-yellow bg-blue-200 relative">
			<AvatarBody playerId={avatarId} type={props.avatar.bodyType} color={props.avatar.bodyColor} />
			<AvatarFace type={props.avatar.faceType} />
		</div>
	);
}

const AvatarBody = (props: IBody) => {
	const avatarBody = AvatarService.getBody(props.type);
	return (
		<object id={props.playerId} data={avatarBody.default.src} type="image/svg+xml" className="relative bottom-0.5"></object>
	);
}

const AvatarFace = (props: IFace) => {
	const [imgSrc, setImgSrc] = useState<{ default: { src: string } }>();

	useEffect(() => {
		setImgSrc(AvatarService.getFaceType(props.type))
	}, [props.type])

	return imgSrc ? (
		<img src={imgSrc.default.src} className="absolute top-0" />
	) : null;
}
