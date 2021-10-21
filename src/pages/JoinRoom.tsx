import React, { useEffect } from 'react';
import { useSocketRoom } from '../hooks';
import { useParams, useHistory } from 'react-router-dom';
import { useDangerSnackbar } from '../hooks/useSnackbar/useSnackbar'
import { useTranslation } from 'react-i18next';
import { LoadingFull } from '../components/Common';

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
				openSnackbar(t('alert.roomDoesNotExist'))
				history.push('/')
			} else {
				history.push('/lobby');
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	return <LoadingFull></LoadingFull>
}