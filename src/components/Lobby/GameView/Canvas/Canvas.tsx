import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { Engine, drawState, ShapeType } from 'memo-draw-engine';

export default function Canvas(): JSX.Element {
	const [backgroundStyle, setBackgroundStyle] = useState<CSSProperties>();
	const canvasRef = useRef<HTMLCanvasElement>();

	useEffect(() => {
		const engine = new Engine(canvasRef.current);
		engine.eventManager.registerDefaultCanvasAndDocumentEvents();
		drawState.shapeType = ShapeType.Pencil;
		drawState.thickness = 5;
		initBackgroundStyle();
	}, []);

	const initBackgroundStyle = (): void => {
		setBackgroundStyle({
			position: 'absolute',
			backgroundColor: 'white',
			zIndex: 0,
			width: `${canvasRef.current.width}px`,
			height: `${canvasRef.current.height}px`,
		});
	};

	return (
		<div>
			<div style={backgroundStyle}></div>
			<canvas style={{ zIndex: 2, position: 'relative' }} width="800" height="600" ref={canvasRef}></canvas>
		</div>
	);
}
