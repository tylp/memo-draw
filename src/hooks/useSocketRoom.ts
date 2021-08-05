import useSocket from './useSocket';

export default function useSocketRoom() {
	return useSocket({namespace: "/room"});
}