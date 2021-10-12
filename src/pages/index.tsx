import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Homepage from './homepage';
import JoinRoom from './JoinRoom';
import Lobby from './Lobby';

export default function App(): JSX.Element {
	return (
		<Router>
			<Switch>
				<Route path="/join/:roomId">
					<JoinRoom />
				</Route>
				<Route path="/lobby">
					<Lobby />
				</Route>
				<Route path="/">
					<Homepage />
				</Route>
			</Switch>
		</Router>
	);
}
