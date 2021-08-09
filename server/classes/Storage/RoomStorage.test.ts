import PlayerFactory from "../../factories/PlayerFactory";
import RoomStorage from "./RoomStorage";
import IdGeneratorService from "../../services/IdGeneratorService";
import ISession from "../../interfaces/ISession";

describe("RoomStorage", () => {
    let storage: RoomStorage;
    const roomId = IdGeneratorService.generate();
    playerOneSession: ISession = {
        sessionId: "string random",
        playerId: "string random",
        profile: {
            
        },
    }

    beforeEach(() => {
        storage = new RoomStorage();
    })

    test("isPlayerPresent", () => {
        storage.isPlayerPresent(roomId, PlayerFactory.create(playerOneSession))
    });

    // test("addPlayer", () => {
    //     expect(storage.containsKey(key)).toBeFalsy();
    //     storage.set(key, value);
    //     expect(storage.containsKey(key)).toBeTruthy();
    // });

    // test("removePlayer", () => {
    //     expect(storage.containsValue(value)).toBeFalsy();
    //     storage.set(key, value);
    //     expect(storage.containsValue(value)).toBeTruthy();
    // });
});