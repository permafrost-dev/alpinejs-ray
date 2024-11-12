// Fake Alpine.js implementation
export class FakeAlpine {
    private stores: Record<string, any> = {};
    private effects: Function[] = [];

    store(name: string, data?: any) {
        if (data !== undefined) {
            this.stores[name] = data;
        }
        return this.stores[name];
    }

    effect(fn: Function) {
        this.effects.push(fn);
        fn();
    }

    updateStore(name: string, data: any) {
        this.stores[name] = data;
        this.effects.forEach(effect => effect());
    }
}
