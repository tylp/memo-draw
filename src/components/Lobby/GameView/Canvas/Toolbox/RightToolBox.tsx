import { AlphaColor, Color } from 'memo-draw-engine';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';

import { customShapesInfo, EngineContext } from './EngineContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const colors: Array<Color> = [
	// black
	new Color(0, 0, 0),
	new Color(125, 125, 125),
	new Color(255, 255, 255),

	// red
	new Color(97, 0, 0),
	new Color(255, 0, 0),
	new Color(255, 143, 143),
	
	// yellow
	new Color(252, 168, 0),
	new Color(255, 255, 0),
	new Color(255, 251, 145),
	
	// green
	new Color(24, 112, 0),
	new Color(0, 255, 0),
	new Color(120, 255, 84),
	
	// blue
	new Color(0, 0, 145),
	new Color(0, 0, 255),
	new Color(0, 255, 255),
	
	// pink
	new Color(92, 0, 153),
	new Color(255, 0, 255),
	new Color(251, 148, 255),
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
		<div className='border-4 border-opacity-50 border-black-black hidden lg:block' style={{
			position: 'relative',
			background: alphaColor.toRgba(),
			width: '7rem',
			height: '7rem',
			borderRadius: '50%',
			marginBottom: '35px',
			marginTop: '15px',
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
		<div className='flex flex-wrap flex-grow overflow-y-auto'
			style={{ marginBottom: '15px' }}>
			{colors.map((color) => (
				<button
					onClick={() => setColor(color)}
					className='hover:opacity-70 duration-200 border-2 border-opacity-50 border-black-black rounded-lg'
					style={{
						minHeight: '25px',
						minWidth: '25px',
						margin: '5px',
						background: color.toRgb(),
						flex: '1 1 20%',
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
		<div className="px-2 w-full mb-3">
			<h5 className="font-semibold text-white-white">Thickness</h5>
			<input
				style={{ width: '100%' }}
				value={range} step="30" min="10" max="100"
				onChange={setThickness} type="range" />
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
		<div className="px-2 w-full mb-3">
			<h5 className="font-semibold text-white-white">Opacity</h5>
			<input
				style={{ width: '100%' }}
				value={range} step="30" min="10" max="100"
				onChange={setOpacity} type="range" />
		</div>
	);
}

export default function RightToolBox(): JSX.Element {
	return (
		<div className="flex-grow flex flex-col items-center p-3 bg-blue-darker-blue rounded-md">
			<SelectionSummary />
			<ColorSelection />
			<ThicknessSlider />
			<OpacitySlider />
		</div>
	);
}
