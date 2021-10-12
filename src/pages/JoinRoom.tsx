import React, { useEffect } from 'react';
import { useSocketRoom } from '../hooks';
import Loading from '../components/Common/Loading/Loading';
import { useParams, useHistory } from 'react-router-dom';

export default function JoinRoom(): JSX.Element {
	const { roomId } = useParams();
	const history = useHistory();

	const socket = useSocketRoom();

	useEffect(() => {
		if (!socket)
			return;
		socket.emit('invited-in-room', roomId, (data) => {
			if (data === false) {
				// TODO: Redirect to homepage, because room does not exist or player is unable to join.
			} else {
				history.push('/lobby');
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	return <Loading />
}