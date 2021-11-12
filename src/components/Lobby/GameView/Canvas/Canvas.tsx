import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { Engine } from 'memo-draw-engine';

export default function Canvas(): JSX.Element {
	const [backgroundStyle, setBackgroundStyle] = useState<CSSProperties>();
	const canvasRef = useRef<HTMLCanvasElement>();
	const [, setEngine] = useState<Engine>();

	useEffect(() => {
		const engine = new Engine(canvasRef.current);
		// engine.eventManager.registerDefaultCanvasAndDocumentEvents();
		setEngine(engine);
		// 	drawState.shapeType = ShapeType.Pencil;
		// 	drawState.thickness = 5;
		// 	drawState.drawPermission = DrawPermission.Master;
		initBackgroundStyle();
	}, []);

	const initBackgroundStyle = (): void => {
		setBackgroundStyle({
			position: 'absolute',
			backgroundColor: 'white',
			zIndex: 1,
			width: `${canvasRef.current.width}px`,
			height: `${canvasRef.current.height}px`,
		});
	};

	return (
		<div>
			<div style={backgroundStyle}></div>
			<canvas width="800" height="600" ref={canvasRef}></canvas>
		</div>
	);
}
