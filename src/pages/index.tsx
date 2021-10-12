import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Homepage from './Homepage';
import Room from './room/[id]';

export default function App(): JSX.Element {
	return (
		<Router>
			<Switch>
				<Route path="/room/:id">
					<Room />
				</Route>
				<Route path="/">
					<Homepage />
				</Route>
			</Switch>
		</Router>
	);
}
