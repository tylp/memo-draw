import React, { useEffect } from 'react';
import { useSocketLobby } from '../../hooks';
import { useParams, useHistory } from 'react-router-dom';
import { useDangerSnackbar } from '../../hooks/useSnackbar/useSnackbar'
import { useTranslation } from 'react-i18next';
import { LoadingFull } from '../../components/Common';
import SocketEventEmitter from '../../services/SocketEventEmitter';

export default function JoinLobby(): JSX.Element {
	const { lobbyId } = useParams();
	const history = useHistory();
	const { t } = useTranslation();

	const [openSnackbar] = useDangerSnackbar()

	const socket = useSocketLobby();

	useEffect(() => {
		if (!socket)
			return;

		SocketEventEmitter.invitedInLobby(socket, lobbyId, (data: boolean) => {
			if (data === false) {
				openSnackbar(t('alert.lobbyDoesNotExist'))
				history.push('/')
			} else {
				history.push('/game');
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	return <LoadingFull></LoadingFull>
}