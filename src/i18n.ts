import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const resources = {
	en: {
		translation: {
			'homepage': {
				'start': 'Done !',
				'rules': {
					'title': 'The Game',
					1: {
						'title': 'Rule 1',
						'content': 'Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet...'
					},
					2: {
						'title': 'Rule 2',
						'content': 'Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet...'
					},
					3: {
						'title': 'Rule 3',
						'content': 'Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet...'
					}
				},
				'profile': {
					'title': 'Who are you ?',
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
			'snackbar': {
				'haventJoinedRoomYet': 'You haven\'t joined a room yet.',
				'youGotKicked': 'You got kicked.',
				'roomDoesNotExist': 'Room does not exist',
				'successfullyCopied' : 'Copied !'
			},
			'gameView': {
				'playersTitle': 'Players',
				'sendDrawing': 'Send Drawing'
			},
			'lobbyView': {
				'playersTitle': 'Players',
				'invite': 'Invite',
				'gameTitle': 'Game',
				'start': 'Start'
			},
			'userCard': {
				'badge': 'It\'s you '
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