import React, { useEffect, useRef, useState } from 'react'

function CustomCanvas() {
	const canRef = useRef(null);
	// let current = {
	// 	color: 'black',
	// 	x: 0,
	// 	y: 0
	//   };
	// let context = canvas.getContext('2d');
	// const [context, setContext] = useState(ref.current.getContext('2d'))
	// const [canvas, setCanvas] = useState(ref.current)
	const [drawing, setDrawing] = useState(false)
	const [current, setCurrent] = useState({color: 'black', x: 0, y: 0})
	
	useEffect(() => {
		canRef.current.getContext('2d');
	});

	useEffect(() => {
		// setContext(ref.current.getContext('2d'));
		return () => {
			//
		}
	}, []);

	const throttle = (callback, delay) => {
		let previousCall = new Date().getTime();
		return () => {
			const time = new Date().getTime();
		
			if ((time - previousCall) >= delay) {
				previousCall = time;
				callback();
				console.log('test');
				
			}
		}
	}

	const mouseDown = (e) => {
		// console.log(e);
		setDrawing(true);
		setCurrent((prev) => ({...prev, x : e.clientX||e.touches[0].clientX}));
		setCurrent((prev) => ({...prev, y : e.clientY||e.touches[0].clientY}));
		console.log(drawing, current.x, current.y);
	}

	const mouseUp = (e) => {
		// console.log(e);
		if (!drawing) { return; }
		setDrawing(false);
		drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
		// drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
	}

	const mouseMove = (e) => {
		if (!drawing) { return; }
		// drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
		// current.x = e.clientX||e.touches[0].clientX;
		// current.y = e.clientY||e.touches[0].clientY;
		
		console.log(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
		drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
		setCurrent((prev) => ({...prev, x : e.clientX||e.touches[0].clientX}));
		setCurrent((prev) => ({...prev, y : e.clientY||e.touches[0].clientY}));
	}

	const drawLine = (x0, y0, x1, y1, color, emit) => {
		console.log(x0, y0, x1, y1, color, emit);
		const canvas = canRef.current;
		const context = canRef.current.getContext('2d');
		context.beginPath;
		context.moveTo(x0, y0);
		context.lineTo(x1, y1);
		// setContext((prev) => ({...prev, strokeStyle: color}));
		// setContext((prev) => ({...prev, lineWidth: 2}));
		context.strokeStyle = color;
		context.lineWidth = 1;
		context.stroke();
		context.closePath();

		// console.log(context);

		// let w = 400;
		// let h = 400;

		

		if (!emit) { return; }

		let h = canvas.height;
		let w = canvas.width;
		// console.log('drawing', {
		// 	x0: x0 / w,
		// 	y0: y0 / h,
		// 	x1: x1 / w,
		// 	y1: y1 / h,
		// 	color: color
		// });

		// socket.emit('drawing', {
		// 	x0: x0 / w,
		// 	y0: y0 / h,
		// 	x1: x1 / w,
		// 	y1: y1 / h,
		// 	color: color
		// });
	}

	function onDrawingEvent(data){
		const canvas = canRef.current;
		const w = canvas.width;
		const h = canvas.height;
		drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
	}

	// make the canvas fill its parent
	function onResize() {
		const canvas = canRef.current;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	return (
		<div 
		// style={{
		// height: '100%',
		// boxSizing: 'border-box',
		// }}
		>
			<canvas
				ref={canRef}
				className="whiteboard"
				// style={{
				// 	height: '100%',
				// 	width: '100%',
				// 	position: 'absolute',
				// 	left: 0,
				// 	right: 0,
				// 	bottom: 0,
				// 	top: 0,
				// 	backgroundColor: 'grey',
				// 	boxSizing: 'border-box',
					
				// 	// height: '700px',
				// 	// width: '1000px',
				// }}
				onMouseDown={mouseDown}
				onMouseUp={mouseUp}
				onMouseMove={(e) => {throttle(mouseMove(e), 30)}}
				// onMouseOut={() => mouseOut()}
			></canvas>
			{/* <div 
			style={{display: 'inline-block',position: 'fixed'}}
			>
				<div style={{
					backgroundColor: 'black',
					display: 'inline-block',
					height: '48px',
					width: '48px',
				}}></div>
				<div class="color red"></div>
				<div class="color green"></div>
				<div class="color blue"></div>
				<div class="color yellow"></div>
			</div> */}
		</div>
	)
}

export default CustomCanvas
