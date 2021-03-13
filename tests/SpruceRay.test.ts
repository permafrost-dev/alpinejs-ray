/* eslint-disable no-undef */

import { SpruceRay } from '../src/SpruceRay';

let spruceRayInstance: SpruceRay,
    fakeSpruce: FakeSpruce,
    fakeRay: FakeRay,
    testState = { rayPayloadHistory: [] };

class FakeRay {
    table(...args: any[]): FakeRay {
        return this.send('table', args);
    }

    send(type: string, ...args: any): FakeRay {
        // @ts-ignore
        testState.rayPayloadHistory.push({ type, args });
        return this;
    }
}

class FakeSpruce {
    public stores: Record<string, any> = {
        mydata: {
            one: 1,
        },
    };

    public watches: Record<string, CallableFunction> = {};

    watch(name: string, callback: CallableFunction) {
        this.watches[name] = callback;
    }

    changeStoreProp(store: string, prop: string, newValue: any) {
        this.stores[store][prop] = newValue;

        if (typeof this.watches[`${store}.${prop}`] !== 'undefined') {
            this.watches[`${store}.${prop}`](newValue);
        }
    }

    store(name: string) {
        if (typeof this.stores[name] === 'undefined') {
            this.stores[name] = {};
        }
        return this.stores[name];
    }
}

const fakeRayFunc = (...args: any[]) => {
    return new FakeRay().send('log', ...args);
};

beforeEach(() => {
    testState = {
        rayPayloadHistory: [],
    };

    fakeRay = new FakeRay();

    fakeSpruce = new FakeSpruce();

    spruceRayInstance = SpruceRay.create(fakeRay, fakeSpruce);
});

it('can watch a store property', () => {
    spruceRayInstance.watch('mydata.one');

    expect(fakeSpruce.watches['mydata.one']).not.toBeUndefined();
});

it('sends an update to Ray when a watched property changes', () => {
    spruceRayInstance.watch('mydata.one');
    fakeSpruce.changeStoreProp('mydata', 'one', 'new_value');

    expect(testState.rayPayloadHistory).toMatchSnapshot();
});

it('unwatches a watched store property', () => {
    spruceRayInstance.watch('mydata.one');

    expect(spruceRayInstance.trackRays['mydata.one']).not.toBeUndefined();

    spruceRayInstance.unwatch('mydata.one');

    expect(spruceRayInstance.trackRays['mydata.one']).toBeUndefined();
});
