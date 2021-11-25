import { AlphaColor, Color } from 'memo-draw-engine';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { EngineContext } from './EngineContext';

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

	return (
		<div style={{
			position: 'relative',
			background: alphaColor.toRgba(),
			width: '6rem',
			height: '6rem',
			borderRadius: '6rem',
			marginBottom: '45px',
		}}>
			<div style={{
				backgroundColor: 'black',
				position: 'absolute',
				width: '4rem',
				height: '4rem',
				borderRadius: '4rem',
				border: '3px solid rgba(255, 255, 255, .5',
				bottom: -15,
				right: -15,
			}}>
				{customDrawState.selectedShape}
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
		<div style={{ marginBottom: '15px' }}>
			{colors.map((color) => (
				<button onClick={() => setColor(color)} style={{ margin: '5px' }} key={color.toRgb()}>
					<svg width="35" height="35">
						<rect fill={color.toRgb()} x="0" y="0" width="35" height="35" />
					</svg>
				</button >
			))}
		</div>
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
			<h5>Thickness</h5>
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
		updateDrawState({ opacity: value / 100});
	};

	return (
		<div>
			<h5>Opacity</h5>
			<input value={range} min="10" max="100" onChange={setOpacity} type="range"></input>
		</div>
	);
}

export default function RightToolBox(): JSX.Element {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				padding: '20px 10px',
			}}
		>
			<SelectionSummary />
			<ColorSelection />
			<ThicknessSlider />
			<OpacitySlider />
		</div>
	);
}
