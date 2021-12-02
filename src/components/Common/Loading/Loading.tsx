import React from 'react';
import AvatarFactory from '../../../../server/factories/AvatarFactory';
import { IAvatar } from '../../../../server/interfaces/IAvatar';
import Avatar from '../Avatar/Avatar';

export default function Loading(): JSX.Element {
	const a: IAvatar = AvatarFactory.create();

	return (
		<div className="animate-spin-bezier h-28 w-28">
			<Avatar avatar={a} />
		</div>
	)
}