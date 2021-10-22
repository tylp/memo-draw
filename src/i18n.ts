import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const resources = {
	en: {
		translation: {
			'alert': {
				'youGotKicked': 'You got kicked.',
				'roomDoesNotExist': 'Room does not exist.',
				'leavedLobby': 'You leaved the room.',
				'haventJoinedRoomYet': 'You haven\'t joined a room yet.',
			},
			'modal': {
				'close': 'Close',
				'validate': 'Validate'
			},
			'homepage': {
				'start': 'Done !',
				'rules': {
					'title': 'The Game',
					1: {
						'title': 'Create a lobby',
						'content': 'Customize your avatar and, when ready, click done!'
					},
					2: {
						'title': 'Invite your friends',
						'content': 'Call your friends and send them an invite!'
					},
					3: {
						'title': 'Have fun!',
						'content': 'Draw faster and faster, be the last one standing!'
					}
				},
				'profile': {
					'title': 'Who are you?',
					'subtitle': 'Hey there!'
				}
			},
			'profileSelector': {
				'title': 'Avatar',
				'eraser': 'Eraser',
				'color': 'Color',
				'face': 'Face',
				'randomize': 'Randomize',
				'nickname': 'Nickname'
			},
			'gameView': {
				'playersTitle': 'Players',
				'sendDrawing': 'Send Drawing'
			},
			'lobbyView': {
				'playersTitle': 'Players',
				'inviteBtnLabel': 'Invite',
				'editProfileBtnLabel': 'Edit',
				'successfullyCopied': 'Invite link copied !',
				'leaveBtnLabel': 'Leave room',
				'gameTitle': 'Game',
				'startBtnLabel': 'Start'
			},
			'userCard': {
				'badge': 'It\'s you'
			},
			'speed': {
				'title': 'Speed',
				'description': 'Choose the game\'s pace ! Are you a fast drawer ? Or maybe you want to draw masterpieces...'
			},
			'speeds': {
				'0': 'Normal',
			},
			'gamemode': {
				'title': 'Gamemode',
				'description': 'Play the classic Memodraw, or a different mode !'
			},
			'gamemodes': {
				'0': 'Classic'
			}
		}
	},
};

i18n
	.use(initReactI18next)
	.init({
		resources,
		lng: 'en',
		interpolation: {
			escapeValue: false
		}
	});

export default i18n;