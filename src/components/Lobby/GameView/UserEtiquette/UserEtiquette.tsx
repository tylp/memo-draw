import React, { useEffect, useState } from 'react';
import Player from '../../../../../server/classes/Player';
import { Color } from '../../../../../server/types/Color';
import { Avatar } from '../../../Common';
import UserEtiquetteStyleBuilder from './UserEtiquetteStyleBuilder';

interface UserEtiquetteSpec {
	player: Player;
	pillTitle?: string | undefined;
	color: Color;
	disabled?: boolean | undefined;
}

UserEtiquette.defaultProps = {
	disabled: false,
}

export default function UserEtiquette(props: UserEtiquetteSpec): JSX.Element {

	const [className, setClassName] = useState((new UserEtiquetteStyleBuilder()).buildColor().getResult());

	useEffect(() => {
		const styleBuilder = new UserEtiquetteStyleBuilder(props.disabled ? 'disabled' : props.color);
		const defaultStyle = 'relative mb-2 flex flex-row items-center w-full h-16 pl-2';

		setClassName(defaultStyle + ' ' + styleBuilder.buildColor().getResult());
	}, [props.color, props.disabled])

	return (
		<div
			className={className}
			style={{
				borderTopLeftRadius: '3em',
				borderBottomLeftRadius: '3em',
				borderTopRightRadius: '0.5em',
				borderBottomRightRadius: '0.5em',
			}}
		>
			<div className="flex-shrink-0 w-10 ml-1">
				<Avatar avatar={props.player.profile.avatar} />
			</div>
			<div className="flex-1 text-lg m-4 font-semibold text-white-white truncate">
				{props.player.profile.username}
			</div>
			{
				props.pillTitle && <Pill title={props.pillTitle} />
			}
		</div>
	)
}

function Pill(props: { title: string }): JSX.Element {
	return (
		<div className="absolute -right-8 bottom-0 pl-1 pr-1 m-0 h-5 rounded-lg transform -rotate-12 bg-pink-dark-pink text-sm font-rubik-bold text-white-white">{props.title}</div>
	)
}