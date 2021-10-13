import React from 'react';
import { BodyColor, BodyType, FaceType, RubberColor } from '../../../../server/interfaces/IProfile';
import Avatar from '../Avatar/Avatar';
import { IAvatar } from '../Avatar/Avatar.spec';
import Title from '../Title/Title';

export default function Loading(): JSX.Element {

	const a: IAvatar = randomAvatar();

	function randomAvatar(): IAvatar {

		return {
			rubberColor: RubberColor[Object.keys(RubberColor)[Math.floor(Math.random() * Object.keys(RubberColor).length)]],
			bodyType: BodyType[Object.keys(BodyType)[Math.floor(Math.random() * Object.keys(BodyType).length)]],
			bodyColor: BodyColor[Object.keys(BodyColor)[Math.floor(Math.random() * Object.keys(BodyColor).length)]],
			faceType: FaceType[Object.keys(FaceType)[Math.floor(Math.random() * Object.keys(FaceType).length)]]
		};
	}

	return (
		<div>
			<Title>Loading...</Title>
			<br/>
			<div className="animate-spin-bezier">
				<Avatar avatar={a}/>		
			</div>
		</div>
	)
}