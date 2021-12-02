import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AlphaColor, Color } from 'memo-draw-engine';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { customShapesInfo, EngineContext } from './EngineContext';

export const colors: Array<Color> = [
	new Color(0, 0, 0),
	new Color(255, 255, 255),
	new Color(125, 125, 125),
	new Color(255, 0, 0),
	new Color(170, 37, 37),
	new Color(255, 230, 0),
	new Color(255, 184, 0),
	new Color(180, 131, 7),
	new Color(29, 229, 0),
	new Color(24, 182, 59),
	new Color(0, 255, 209),
	new Color(21, 171, 236),
	new Color(18, 40, 240),
	new Color(112, 0, 255),
	new Color(232, 21, 223),
];

function SelectionSummary(): JSX.Element {
	const { customDrawState } = useContext(EngineContext);

	const alphaColor = new AlphaColor(
		customDrawState.color.red,
		customDrawState.color.green,
		customDrawState.color.blue,
		customDrawState.opacity * 255,
	);

	const selectedShapeInfo = customShapesInfo.find(
		(shapeInfo) => shapeInfo.type === customDrawState.selectedShape,
	);

	return (
		<div style={{
			position: 'relative',
			background: alphaColor.toRgba(),
			width: '6rem',
			height: '6rem',
			borderRadius: '6rem',
			marginBottom: '45px',
		}}>
			<div className="text-yellow-light-yellow" style={{
				backgroundColor: 'black',
				position: 'absolute',
				width: '4rem',
				height: '4rem',
				borderRadius: '4rem',
				bottom: -15,
				right: -15,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
				<FontAwesomeIcon size="2x" icon={selectedShapeInfo.icon} />
			</div>
		</div>
	)
}

function ColorSelection(): JSX.Element {
	const { updateDrawState } = useContext(EngineContext);

	const setColor = (color: Color): void => {
		updateDrawState({ color });
	};

	return (
		<div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
			{colors.map((color) => (
				<button
					onClick={() => setColor(color)}
					className='hover:opacity-70 duration-200'
					style={{
						margin: '5px',
						height: '30px',
						background: color.toRgb(),
						flex: '1 1 30px',
						borderRadius: '2px',
					}}
					key={color.toRgb()}
				/>
			))
			}
		</div >
	);
}

function ThicknessSlider(): JSX.Element {
	const [range, setRange] = useState<number>(100);
	const { customDrawState, updateDrawState } = useContext(EngineContext);

	useEffect(() => {
		setRange(customDrawState.thickness * 10);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const setThickness = (event: ChangeEvent<HTMLInputElement>): void => {
		const value = Number(event.currentTarget.value);
		setRange(value);
		updateDrawState({ thickness: value / 10 });
	};

	return (
		<div style={{ marginBottom: '15px' }}>
			<h5 className="font-semibold text-white-white">Thickness</h5>
			<input value={range} min="10" max="100" onChange={setThickness} type="range"></input>
		</div>
	);
}

function OpacitySlider(): JSX.Element {
	const [range, setRange] = useState<number>(100);
	const { customDrawState, updateDrawState } = useContext(EngineContext);

	useEffect(() => {
		setRange(customDrawState.opacity * 100);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const setOpacity = (event: ChangeEvent<HTMLInputElement>): void => {
		const value = Number(event.currentTarget.value);
		setRange(value);
		updateDrawState({ opacity: value / 100 });
	};

	return (
		<div>
			<h5 className="font-semibold text-white-white">Opacity</h5>
			<input value={range} min="10" max="100" onChange={setOpacity} type="range"></input>
		</div>
	);
}

export default function RightToolBox(): JSX.Element {
	return (
		<div className="flex-grow flex flex-col items-center p-2 bg-blue-darker-blue rounded-md">
			<SelectionSummary />
			<ColorSelection />
			<ThicknessSlider />
			<OpacitySlider />
		</div>
	);
}
