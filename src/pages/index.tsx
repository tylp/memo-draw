import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Homepage from './Homepage/Homepage';
import JoinRoom from './JoinRoom/JoinRoom';
import Lobby from './Lobby/Lobby';
import SnackbarProvider from 'react-simple-snackbar'

export default function App(): JSX.Element {
	return (
		<SnackbarProvider>
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
		</SnackbarProvider>
	);
}
