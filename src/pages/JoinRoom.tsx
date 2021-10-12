import React, { useEffect } from 'react';
import { useSocketRoom } from '../hooks';
import Loading from '../components/Common/Loading/Loading';
import { useParams, useHistory } from 'react-router-dom';
import { useDangerSnackbar } from '../hooks/useSnackbar/useSnackbar'

export default function JoinRoom(): JSX.Element {
	const { roomId } = useParams();
	const history = useHistory();

	const [openSnackbar] = useDangerSnackbar()

	const socket = useSocketRoom();

	useEffect(() => {
		if (!socket)
			return;
		socket.emit('invited-in-room', roomId, (data) => {
			if (data === false) {
				openSnackbar('Room does not exist.')
				history.push('/')
			} else {
				history.push('/lobby');
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	return <Loading />
}