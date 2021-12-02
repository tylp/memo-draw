import { Color, drawState, Engine, ShapeType } from 'memo-draw-engine';
import React, { createContext, useState } from 'react';
import { faPen, faFill, faSquare as faSquareFill, faCircle as faCircleFill, faEraser } from '@fortawesome/free-solid-svg-icons';
import { faSquare as faSquare, faCircle, faWindowMinimize } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export const backgroundColor = new Color(255, 255, 255);

export interface ShapeInfo {
	name: string,
	icon: IconProp,
	type: CustomShapeType,
}

export const customShapesInfo: Array<ShapeInfo> = [
	{ name: 'Pencil', icon: faPen, type: ShapeType.Pencil },
	{ name: 'Fill', icon: faFill, type: ShapeType.Fill },
	{ name: 'Rectangle S', icon: faSquare, type: ShapeType.RectangleStroke },
	{ name: 'Rectangle F', icon: faSquareFill, type: ShapeType.RectangleFull },
	{ name: 'Ellipse S', icon: faCircle, type: ShapeType.EllipseStroke },
	{ name: 'Ellipse F', icon: faCircleFill, type: ShapeType.EllipseFull },
	{ name: 'Line', icon: faWindowMinimize, type: ShapeType.Line },
	{ name: 'Eraser', icon: faEraser, type: 'Eraser' },
]

export type CustomShapeType = ShapeType | 'Eraser';

interface CustomDrawState {
	thickness: number,
	color: Color,
	opacity: number,
	selectedShape: CustomShapeType,
}

const defaultDrawState: CustomDrawState = {
	thickness: 5,
	color: new Color(0, 0, 0),
	opacity: 255,
	selectedShape: ShapeType.Pencil,
}

interface EngineContextSpec {
	customDrawState: CustomDrawState,
	updateDrawState: (newCustomDrawState: Partial<CustomDrawState>) => void,
	engine: Engine,
}

export const EngineContext = createContext<EngineContextSpec>({
	customDrawState: defaultDrawState,
	updateDrawState: null,
	engine: null,
});

export function EngineContextProvider ({ engine, children }: { engine : Engine, children: React.ReactNode }): JSX.Element {
	const [customDrawState, setCustomDrawState] = useState<CustomDrawState>(defaultDrawState);

	const setEngineProperties = (newCustomDrawState: CustomDrawState) => {
		drawState.color = newCustomDrawState.selectedShape === 'Eraser'
			? backgroundColor
			: newCustomDrawState.color;
		drawState.opacity = newCustomDrawState.opacity;
		drawState.thickness = newCustomDrawState.thickness;
		drawState.shapeType = newCustomDrawState.selectedShape === 'Eraser'
			? ShapeType.Pencil
			: newCustomDrawState.selectedShape;
	}

	const updateDrawState = (partialCustomDrawState: Partial<CustomDrawState>) => {
		const newCustomDrawState = { ...customDrawState, ...partialCustomDrawState };
		setEngineProperties(newCustomDrawState);
		setCustomDrawState(newCustomDrawState)
	}

	const contextValue = {
		customDrawState,
		updateDrawState,
		engine,
	};

	return (
		<EngineContext.Provider value={contextValue}>
			{children}
		</EngineContext.Provider>
	);
}
