import IProfile from './IProfile';

export default interface ISession {
	sessionId?: string,
	playerId?: string,
	playerRoomId?: string,
	profile?: IProfile
}