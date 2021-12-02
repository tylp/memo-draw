import IProfile from './IProfile';

export default interface ISession {
	sessionId?: string,
	playerId?: string,
	playerLobbyId?: string,
	profile?: IProfile
}