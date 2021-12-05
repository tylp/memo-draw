import React, { useContext, useEffect, useState } from 'react';
import { customShapesInfo, CustomShapeType, EngineContext } from './EngineContext';
import { faUndoAlt, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Box } from '../../../../Common';

interface btnToolBoxProps {
	selected?: boolean,
	onClick?: () => void,
	icon: IconProp,
	color: 'blue' | 'yellow',
}

function BtnToolBox(props: btnToolBoxProps): JSX.Element {

	const [color, setColor] = useState('');

	useEffect(() => {
		if (props.selected) {
			setColor('white-white bg-blue-200');
		} else {
			setColor(props.color == 'blue' ? 'blue-light-blue ' : props.color == 'yellow' ? 'yellow-light-yellow ' : '');
		}
	}, [props.color, props.selected]);

	return (
		<button
			style={{ flex: '1 0' }}
			className={`rounded-lg m-1 border-2 border-${color}`}
			onClick={props.onClick}
		>
			<Box ml={3.5} mr={3.5} mt={2} mb={2}>
				<span className={`text-2xl text-${color}`}>
					<FontAwesomeIcon icon={props.icon} />
				</span>
			</Box>
		</button>
	)
}

function ShapesSelection(): JSX.Element {
	const { updateDrawState, customDrawState } = useContext(EngineContext);

	const setShape = (shapeType: CustomShapeType) => {
		updateDrawState({ selectedShape: shapeType });
	};

	return (
		<>
			{customShapesInfo.map((shape) => (
				<BtnToolBox
					selected={shape.type === customDrawState.selectedShape}
					color="yellow"
					icon={shape.icon}
					key={shape.name}
					onClick={() => { setShape(shape.type) }} />
			))}
		</>
	);
}

function UndoRedoSelection(): JSX.Element {
	const { engine } = useContext(EngineContext)

	const undo = (): void => {
		engine.shapeManager.internalEventManager.undo();
	};

	const redo = (): void => {
		engine.shapeManager.internalEventManager.redo();
	};

	return (
		<>
			<BtnToolBox icon={faUndoAlt} color="blue" onClick={() => undo()} />
			<BtnToolBox icon={faRedoAlt} color="blue" onClick={() => redo()} />
		</>
	);
}

function VerticalDivider(): JSX.Element {
	return (
		<div className="hidden lg:block" style={{
			width: '2px',
			height: '40px',
			background: 'rgba(255, 255, 255, .15)',
			margin: '0 5px',
		}} />
	);
}

export default function BottomToolBox(): JSX.Element {

	return (
		<div className="flex flex-wrap items-center p-2 mt-3 bg-blue-darker-blue rounded-md">
			<UndoRedoSelection />
			<VerticalDivider />
			<ShapesSelection />
		</div>
	);
}