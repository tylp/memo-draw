import React, { useEffect, useState } from 'react';
import Player from '../../../../server/classes/Player';
import { Color } from '../../../../server/types/Color';
import { Avatar } from '../../Common';
import UserEtiquetteStyleBuilder from './UserEtiquetteStyleBuilder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface UserEtiquetteSpec {
	player: Player;
	rPillTitle?: string | undefined;
	brPillTitle?: string | undefined;
	color: Color;
	disabled?: boolean | undefined;
	onLeftPillClick?: (() => void) | undefined;
	leftPillIcon?: IconProp
}

UserEtiquette.defaultProps = {
	disabled: false,
}

export default function UserEtiquette(props: UserEtiquetteSpec): JSX.Element {

	const [className, setClassName] = useState((new UserEtiquetteStyleBuilder()).buildColor().getResult());

	useEffect(() => {
		const styleBuilder = new UserEtiquetteStyleBuilder(props.disabled ? 'disabled' : props.color);
		const defaultStyle = 'relative flex flex-row items-center w-full h-16 pl-2 z-10';

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
				props.rPillTitle && <Pill position="r" title={props.rPillTitle} />
			}
			{
				props.brPillTitle && <Pill position="br" title={props.brPillTitle} />
			}
			{
				props.onLeftPillClick && (
					<div style={{ position: 'absolute', left: 0, bottom: 2, zIndex: 1 }}>
						<button
							onClick={props.onLeftPillClick}
							style={{
								border: 'none',
								height: '25px',
								width: '25px',
								borderRadius: '50%',
								color: 'white',
							}}
							className="bg-pink-dark-pink hover:bg-pink-light-pink transition duration-300">
							<FontAwesomeIcon icon={props.leftPillIcon} />
						</button>
					</div>

				)
			}
		</div>
	)
}

type Position = 'br' | 'r';

interface PillProps {
	title: string;
	position: Position;
}

function Pill(props: PillProps): JSX.Element {
	const [className, setClassName] = useState('');

	const getClassFrom = (position: Position): string => {
		let className = 'absolute m-0 h-5 rounded-lg transform -rotate-12 text-sm font-rubik-bold text-white-white'

		switch (position) {
			case 'r':
				className += ' -right-0 md:-right-4 top-4 pl-1 pr-1 bg-yellow-dark-yellow';
				break;
			case 'br':
				className += ' -right-0 md:-right-6 bottom-0 pl-1 pr-1 bg-pink-dark-pink';
				break;
		}

		return className;
	}

	useEffect(() => {
		setClassName(getClassFrom(props.position));
	}, [props.position])

	return <div className={className}>{props.title}</div>
}