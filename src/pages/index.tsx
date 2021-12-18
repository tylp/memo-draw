import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Homepage from './Homepage/Homepage';
import JoinLobby from './JoinLobby/JoinLobby';
import Lobby from './Lobby/Lobby';
import SnackbarProvider from 'react-simple-snackbar'
import NotFound from './Error/NotFound';

export default function App(): JSX.Element {
	return (
		<SnackbarProvider>
			<Router>
				<Switch>
					<Route path="/join/:lobbyId">
						<JoinLobby />
					</Route>
					<Route path="/game">
						<Lobby />
					</Route>
					<Route path="/" exact>
						<Homepage />
					</Route>
					<Route path="*">
						<NotFound />
					</Route>
				</Switch>
			</Router>
		</SnackbarProvider>
	);
}
