import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const resources = {
	en: {
		translation: {
			'alert': {
				'youGotKicked': 'You got kicked.',
				'lobbyDoesNotExist': 'Lobby does not exist.',
				'leavedLobby': 'You left the lobby.',
				'haventJoinedLobbyYet': 'You haven\'t joined a lobby yet.',
				'lengthError': 'Username\'s length should be greater than 2.',
			},
			'modal': {
				'close': 'Close',
				'validate': 'Validate',
			},
			'homepage': {
				'start': 'Done !',
				'rules': {
					'title': 'The Game',
					1: {
						'title': 'Create a lobby',
						'content': 'Customize your avatar and, when ready, click done!',
					},
					2: {
						'title': 'Invite your friends',
						'content': 'Call your friends and send them an invite!',
					},
					3: {
						'title': 'Have fun!',
						'content': 'Draw faster and faster, be the last one standing!',
					},
				},
				'profile': {
					'title': 'Who are you?',
					'subtitle': 'Hey there!',
				},
			},
			'profileSelector': {
				'title': 'Avatar',
				'eraser': 'Eraser',
				'color': 'Color',
				'face': 'Face',
				'randomize': 'Randomize',
				'nickname': 'Nickname',
			},
			'gameView': {
				'playersTitle': 'Players',
				'spectatorsTitle': 'Spectators',
				'sendDrawing': 'Send Drawing',
				'startVote': 'Start Vote',
				'playAgain': 'Play again',
				'selectDrawing': 'Select a drawing',
				'hasThisPlayerMadeAnError': 'Has this player made an error?',
				'currentlyDrawing': 'Drawing',
				'itsYouLabel': 'It\'s You',
				'yes': 'Yes',
				'no': 'No',
			},
			'lobbyView': {
				'playersTitle': 'Players',
				'inviteBtnLabel': 'Invite',
				'editProfileBtnLabel': 'Edit profile',
				'successfullyCopied': 'Invite link copied !',
				'leaveBtnLabel': 'Leave lobby',
				'gameTitle': 'Game',
				'startBtnLabel': 'Start',
				'cantStartGameAlone': 'You can\'t start the game by yourself!',
			},
			'userCard': {
				'badge': 'It\'s you',
			},
			'gamemodes': {
				'0': {
					'title': 'Classic',
					'description': 'Classic mode, for a classic play.',
				},
				'1': {
					'title': 'Anarchy',
					'description': 'Faster drawings!',
				},
			},
		},
	},
};

i18n
	.use(initReactI18next)
	.init({
		resources,
		lng: 'en',
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;