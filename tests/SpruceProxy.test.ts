/* eslint-disable no-undef */
import { SpruceProxy } from '../src/SpruceProxy';

let rayInstance: any, win: any, proxy: SpruceProxy, testState: AlpineRayMagicMethodTestState;
interface AlpineRayMagicMethodTestState {
    alpineMagicProperties: any[];
    alpineComponentInitCallbacks: CallableFunction[];
    rayPayloadHistory: any[];
    documentEventListeners: any[];
    windowEventListeners: any[];
    deferLoadingAlpineCallCounter: number;
}

const getFreshTestState = (): AlpineRayMagicMethodTestState => {
    return {
        alpineMagicProperties: [],
        alpineComponentInitCallbacks: [],
        rayPayloadHistory: [],
        documentEventListeners: [],
        windowEventListeners: [],
        deferLoadingAlpineCallCounter: 0,
    };
};

class FakeRay {
    table(...args: any[]): FakeRay {
        return this.send('table', args);
    }

    send(type: string, ...args: any): FakeRay {
        // set the 'updated' prop to a static value
        if (args.length > 0 && Array.isArray(args[0])) {
            args[0] = args[0].map(arg => {
                if (arg && typeof arg['updated'] !== 'undefined') {
                    arg['updated'] = 1615351401000;
                }
                return arg;
            });
        }

        testState.rayPayloadHistory.push({ type, args });

        return this;
    }
}

beforeEach(() => {
    win = {
        axios: {},
        alpineRayConfig: {
            logComponentsInit: false,
            logCustomEvents: false,
        },
        Spruce: {
            store(name: string) {
                if (typeof this.stores[name] === 'undefined') {
                    this.stores[name] = {};
                }
                return this.stores[name];
            },
            stores: {
                mydata: {
                    one: 1,
                },
            },
        },
        Alpine: {
            version: '5.0.0',
            addMagicProperty(name: string, callback: CallableFunction) {
                testState.alpineMagicProperties.push({ name, callback });
            },
            onComponentInitialized(callback) {
                testState.alpineComponentInitCallbacks.push(callback);
            },
        },
        document: {
            readyState: 'not_ready',
            addEventListener(name: string, callback: CallableFunction) {
                testState.documentEventListeners.push({ name, callback });
            },
        },
        deferLoadingAlpine() {
            testState.deferLoadingAlpineCallCounter++;
        },
        addEventListener(name: string, callback: CallableFunction) {
            testState.windowEventListeners.push({ name, callback });
        },
    };

    testState = getFreshTestState();

    rayInstance = (...args: any[]) => {
        testState.rayPayloadHistory.push(...args);

        return new FakeRay();
    };

    proxy = new SpruceProxy(win, rayInstance);
});

it('checks for Spruce installation', () => {
    let err = null;

    try {
        proxy.checkForSpruce();
    } catch (e) {
        err = e;
    }

    expect(err).toBeNull();
});

it('displays tracking for a store', () => {
    proxy.displayTracking('mykey', 'read', { a: 11 });
    proxy.displayTracking('mykey', 'read', { a: 25 });

    expect(testState.rayPayloadHistory).toMatchSnapshot();
});

it('dumps a store', () => {
    proxy.dumpStore('mykey');

    expect(testState.rayPayloadHistory).toMatchSnapshot();
});

it('dumps all stores', () => {
    proxy.dumpAllStores();

    expect(testState.rayPayloadHistory).toMatchSnapshot();
});
