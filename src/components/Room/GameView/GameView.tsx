import React from "react";
import { Game } from "../../../../server/classes/Game";
import { Layout } from "../../Common";

interface GameProps {
    game: Game;
}

export function GameView(props: GameProps): JSX.Element {
    return (
        <Layout>
            {
                props.game.currentTurnPlayerId
            }
        </Layout>
    )
}