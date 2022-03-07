/* eslint-disable no-undef */

import { initializeErrorEventHandlers, initializePlugins } from '../../src/lib/initializeLibrary';

let rayInstance: any, win: any, testState: AlpineRayMagicMethodTestState;
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
            interceptErrors: true,
            interceptSpruce: true,
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
});

class FakePlugin {
    public initCounter = 0;

    public init() {
        this.initCounter++;
    }
}

it('initializes the library plugins', () => {
    const plugin1 = new FakePlugin();
    const plugin2 = new FakePlugin();

    initializePlugins([plugin1, plugin2], win, rayInstance);

    expect(plugin1.initCounter).toStrictEqual(1);
    expect(plugin2.initCounter).toStrictEqual(1);
});

it('initializes the error event handlers', () => {
    win.alpineRayConfig.interceptErrors = true;

    initializeErrorEventHandlers(win, rayInstance);

    expect(testState.windowEventListeners.length).toStrictEqual(2);
    expect(testState.windowEventListeners.map(el => el.name)).toStrictEqual(['error', 'unhandledrejection']);
});
