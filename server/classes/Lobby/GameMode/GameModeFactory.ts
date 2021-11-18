import { GameModeProperties } from '../../../enums/GameProperties';
import GameMode from './GameMode';
import ClassicGameMode from './ClassicGameMode';
import AnarchyGameMode from './AnarchyGameMode';

export default class GameModeFactory {
	public static create(gm: GameModeProperties): GameMode {
		switch (gm) {
			case GameModeProperties.Classic:
				return new ClassicGameMode();
			case GameModeProperties.Anarchy:
				return new AnarchyGameMode();
		}
	}
}