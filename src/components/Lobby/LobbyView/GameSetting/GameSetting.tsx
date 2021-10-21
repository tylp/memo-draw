import React, { Dispatch, SetStateAction } from 'react';
import { RadioList, Title } from '../../../Common';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRadioNode } from '../../../../../server/interfaces/IRadioNode';

interface GameSettingSpec {
	name: string,
	title: string,
	list: IRadioNode[],
	setCurrentValue: Dispatch<SetStateAction<string | number>>,
	currentValue: string | number
}

export function GameSetting(props: GameSettingSpec): JSX.Element {
	const speedPropertiesValues = Object.values(props.list)

	return (
		<div className="pt-3 pb-3 pl-3 pr-3 mr-4 h-auto w-96 bg-blue-darker-blue rounded-md flex flex-col">
			<div className="flex flex-row justify-between">
				<Title>{props.title}</Title>
				<FontAwesomeIcon className="text-yellow-light-yellow text-2xl" icon={faStopwatch} />
			</div>

			<p className="leading-tight text-white-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

			<div className="flex flex-row justify-around">
				<RadioList name={props.name} list={speedPropertiesValues} currentValue={props.currentValue} setCurrentValue={props.setCurrentValue} color='light-secondary' size='big' />
			</div>
		</div>
	);
}