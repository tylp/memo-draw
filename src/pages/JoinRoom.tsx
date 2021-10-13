import React, { useEffect } from 'react';
import { useSocketRoom } from '../hooks';
import Loading from '../components/Common/Loading/Loading';
import { useParams, useHistory } from 'react-router-dom';
import { useDangerSnackbar } from '../hooks/useSnackbar/useSnackbar'
import { useTranslation } from 'react-i18next';

export default function JoinRoom(): JSX.Element {
	const { roomId } = useParams();
	const history = useHistory();
	const { t } = useTranslation();

	const [openSnackbar] = useDangerSnackbar()

	const socket = useSocketRoom();

	useEffect(() => {
		if (!socket)
			return;
		socket.emit('invited-in-room', roomId, (data) => {
			if (data === false) {
				openSnackbar(t('snackbar.roomDoesNotExist'))
				history.push('/')
			} else {
				history.push('/lobby');
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	return <Loading />
}