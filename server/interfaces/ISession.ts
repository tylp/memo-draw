import IProfile from './IProfile';

export default interface ISession {
	sessionId?: string,
	playerId?: string,
	profile?: IProfile
}