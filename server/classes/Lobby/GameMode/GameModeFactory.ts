import { GameModeProperty } from '../../../enums/GameProperties';
import GameMode from './GameMode';
import ClassicGameMode from './ClassicGameMode';
import AnarchyGameMode from './AnarchyGameMode';

export default class GameModeFactory {
	public static create(gm: GameModeProperty): GameMode {
		switch (gm) {
			case GameModeProperty.Classic:
				return new ClassicGameMode();
			case GameModeProperty.Anarchy:
				return new AnarchyGameMode();
		}
	}
}