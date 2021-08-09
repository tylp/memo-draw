import Storage from "./Storage";

class StorageImpl extends Storage<string, string> {
    //
}

describe("Storage", () => {
    let storage: StorageImpl;
    
    const key = "Random key";
    const value = "Just a random value";
    
    beforeEach(() => {
        storage = new StorageImpl();
    });
    
    test("get and set", () => {
        expect(storage.get(key)).toBeUndefined();
        expect(storage.set(key, value)).toBe(value);
        expect(storage.get(key)).toBe(value);
    });

    test("containsKey", () => {
        expect(storage.containsKey(key)).toBeFalsy();
        storage.set(key, value);
        expect(storage.containsKey(key)).toBeTruthy();
    });

    test("containsValue", () => {
        expect(storage.containsValue(value)).toBeFalsy();
        storage.set(key, value);
        expect(storage.containsValue(value)).toBeTruthy();
    });

    test("all", () => {
        const allEmpty = storage.all();
        expect(allEmpty.size).toBe(0);
        
        storage.set(key, value);
        const allNotEmpty = storage.all();
        expect(allNotEmpty.size).toBe(1);
    });

    test("toArray", () => {
        const toArrayEmpty = storage.toArray();
        expect(toArrayEmpty.length).toBe(0);
        
        storage.set(key, value);
        const toArrayNotEmpty = storage.toArray();
        expect(toArrayEmpty.length).toBe(0);
        expect(toArrayNotEmpty.length).toBe(1);
    })

    test("isEmpty", () => {
        expect(storage.isEmpty()).toBeTruthy();
        storage.set(key, value);
        expect(storage.isEmpty()).toBeFalsy();
    })
});