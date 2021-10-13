import React from 'react';
import AvatarFactory from '../../../../server/factories/AvatarFactory';
import Avatar from '../Avatar/Avatar';
import { IAvatar } from '../Avatar/Avatar.spec';
import Title from '../Title/Title';

export default function Loading(): JSX.Element {

	const a: IAvatar = AvatarFactory.create();
	return (
		<div>
			<Title>Loading...</Title>
			<div className="animate-spin-bezier">
				<Avatar avatar={a}/>		
			</div>
		</div>
	)
}