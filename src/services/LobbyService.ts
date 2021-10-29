export default class LobbyService {
	public static getRoomIdFromUrl(url: string): string {
		const split = url.toString().split('/');
		return split[split.length - 1];
	}
}