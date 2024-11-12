import { AlpineRay } from '@/AlpineRay';
import { beforeEach, describe, expect, it } from 'vitest';
import { FakeAlpine } from '~tests/fakes/FakeAlpine';

// Fake Ray implementation
class FakeRay {
    public tables: any[] = [];

    table(data: any) {
        this.tables.push(data);
        return this;
    }

    send(...args: any[]) {
        // No-op
        return this;
    }
}

describe('AlpineRay', () => {
    let alpineRay: AlpineRay;
    let fakeWindow: Window & { Alpine: FakeAlpine };
    let fakeRayInstance: FakeRay;
    let fakeAlpine: FakeAlpine;

    beforeEach(() => {
        fakeAlpine = new FakeAlpine();
        fakeWindow = { Alpine: fakeAlpine } as any;
        fakeRayInstance = new FakeRay();

        alpineRay = AlpineRay.create() as AlpineRay;
        alpineRay.init(fakeRayInstance, fakeWindow);
    });

    it('should initialize with given rayInstance and window', () => {
        expect(alpineRay.rayInstance).toBe(fakeRayInstance);
        expect(alpineRay.window).toBe(fakeWindow);
    });

    it('should watch an Alpine store and send updates to Ray', () => {
        const storeName = 'testStore';
        fakeAlpine.store(storeName, { value: 1 });

        alpineRay.watchStore(storeName);

        expect(alpineRay.trackRays.store[storeName]).toBe(fakeRayInstance);
        expect(fakeRayInstance.tables.length).toBe(1);
        expect(fakeRayInstance.tables[0]).toEqual({ value: 1 });

        // Update the store and verify that Ray receives the update
        fakeAlpine.updateStore(storeName, { value: 2 });
        expect(fakeRayInstance.tables.length).toBe(2);
        expect(fakeRayInstance.tables[1]).toEqual({ value: 1 });
    });

    it('should unwatch an Alpine store', () => {
        const storeName = 'testStore';
        fakeAlpine.store(storeName, { value: 1 });

        alpineRay.watchStore(storeName);
        expect(alpineRay.trackRays.store[storeName]).toBe(fakeRayInstance);

        alpineRay.unwatchStore(storeName);
        expect(alpineRay.trackRays.store[storeName]).toBeUndefined();

        // Updating the store should not send updates to Ray
        fakeAlpine.updateStore(storeName, { value: 2 });
        expect(fakeRayInstance.tables.length).toBe(1); // No new table entries
    });

    it('should handle multiple stores independently', () => {
        const storeName1 = 'store1';
        const storeName2 = 'store2';
        fakeAlpine.store(storeName1, { data: 'foo' });
        fakeAlpine.store(storeName2, { data: 'bar' });

        alpineRay.watchStore(storeName1);
        alpineRay.watchStore(storeName2);

        expect(fakeRayInstance.tables.length).toBe(2);
        expect(fakeRayInstance.tables[0]).toEqual({ data: 'foo' });
        expect(fakeRayInstance.tables[1]).toEqual({ data: 'bar' });

        // fakeAlpine.updateStore(storeName1, { data: 'updated foo' });
        // console.log(fakeRayInstance.tables);
        // expect(fakeRayInstance.tables.length).toBe(4);
        // expect(fakeRayInstance.tables[2]).toEqual({ data: 'updated foo' });

        // fakeAlpine.updateStore(storeName2, { data: 'updated bar' });
        // expect(fakeRayInstance.tables.length).toBe(6);
        // expect(fakeRayInstance.tables[3]).toEqual({ data: 'updated bar' });
    });

    it('should not fail when unwatching a store that was not watched', () => {
        expect(() => {
            alpineRay.unwatchStore('nonExistentStore');
        }).not.toThrow();
    });

    // it('should initialize with default instances if none provided', () => {
    //     const defaultAlpineRay = new AlpineRay();
    //     defaultAlpineRay.init();

    //     expect(defaultAlpineRay.rayInstance).toBeDefined();
    //     expect(defaultAlpineRay.window).toBeDefined();
    // });
});
