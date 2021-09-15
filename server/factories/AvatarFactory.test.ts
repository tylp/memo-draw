import AvatarFactory from "./AvatarFactory";

describe("AvatarFactory", () => {
    test('AvatarFactory should work', () => {
        const avatar = AvatarFactory.create();
        expect(avatar.bodyColor).toBeDefined();
        expect(avatar.bodyType).toBeDefined();
        expect(avatar.faceType).toBeDefined();
        expect(avatar.rubberColor).toBeDefined();
    })
});