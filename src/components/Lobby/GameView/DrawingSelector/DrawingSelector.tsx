import React from 'react';
import { useTranslation } from 'react-i18next';

interface DrawingSelectorProps {
	list: Array<number>;
	selected: number | undefined;
	setSelected: React.Dispatch<(prevState: undefined) => undefined>;
}

export default function DrawingSelector(props: DrawingSelectorProps): JSX.Element {
	const { t } = useTranslation();

	const handleSelect = (e) => {
		props.setSelected(e.target.value);
	}

	return (
		<label className="block text-left">
			<span className="text-gray-700">{t('gameView.selectDrawing')}</span>
			<select className="form-multiselect block w-full mt-1" onChange={handleSelect} value={props.selected}>
				{
					props.list.map(e => <option key={e} value={e}>Option {e}</option>)
				}
			</select>
		</label>
	)
}
