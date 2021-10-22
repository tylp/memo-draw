import React, { Dispatch, SetStateAction } from 'react';
import { RadioList, Title } from '../../../Common';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRadioNode } from '../../../../../server/interfaces/IRadioNode';
import { useTranslation } from 'react-i18next';


interface GameSettingSpec {
    for: string,
	list: IRadioNode[],
	setCurrentValue: Dispatch<SetStateAction<string | number>>,
	currentValue: string | number
}

export function GameSetting(props: GameSettingSpec): JSX.Element {
    const { t } = useTranslation()
	const speedPropertiesValues = Object.values(props.list)

	return (
		<div className="pt-3 pb-3 pl-3 pr-3 mr-4 h-auto w-96 bg-blue-darker-blue rounded-md flex flex-col">
			<div className="flex flex-row justify-between">
				<Title>{t(`${props.for}.title`)}</Title>
				<FontAwesomeIcon className="text-yellow-light-yellow text-2xl" icon={faStopwatch} />
			</div>

			<p className="leading-tight text-white-white">{t(`${props.for}.description`)}</p>

			<div className="flex flex-row justify-around">
				<RadioList list={speedPropertiesValues} currentValue={props.currentValue} setCurrentValue={props.setCurrentValue} color='light-secondary' size='large' />
			</div>
		</div>
	);
}