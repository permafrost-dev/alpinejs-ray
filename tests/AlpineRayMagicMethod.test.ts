/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import AlpineRayMagicMethod from '../src/AlpineRayMagicMethod';

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
        },
        Alpine: {
            version: '5.0.0',
            magic(name: string, callback: CallableFunction) {
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

it('starts the magic method class', () => {
    AlpineRayMagicMethod.start(win, rayInstance);

    expect(testState.alpineMagicProperties.length).toBe(1);
    expect(testState.alpineMagicProperties[0].name).toBe('ray');
    expect(testState.alpineMagicProperties[0].callback()).toBe(rayInstance);
});

it('throws an error during start() if AlpineJS is not installed', () => {
    let err = null;
    try {
        AlpineRayMagicMethod.start({ axios: {} }, rayInstance);
    } catch (e) {
        err = e;
    }

    expect(err).not.toBeNull();
});

it('throws an error during start() if axios is not installed', () => {
    let err = null;
    try {
        delete win['axios'];
        AlpineRayMagicMethod.start(win, rayInstance);
    } catch (e) {
        err = e;
    }

    expect(err).not.toBeNull();
});

it('creates an event handler for document.readystatechange', () => {
    win.document.readyState = 'not_ready';
    AlpineRayMagicMethod.initOnDocumentReady(win);
    testState.documentEventListeners.forEach(listener => listener.callback());

    expect(testState.documentEventListeners.length).toBe(1);
    expect(testState.documentEventListeners[0].name).toBe('readystatechange');
    expect(testState.deferLoadingAlpineCallCounter).toBe(0);
});

it('calls deferLoadingAlpine() when document state is "ready"', () => {
    win.document.readyState = 'ready';
    AlpineRayMagicMethod.initOnDocumentReady(win);
    testState.documentEventListeners.forEach(listener => listener.callback());

    expect(testState.documentEventListeners.length).toBe(1);
    expect(testState.documentEventListeners[0].name).toBe('readystatechange');
    expect(testState.deferLoadingAlpineCallCounter).toBe(1);
});

it('creates a handler for component initializations', () => {
    const config = { logComponentsInit: false, logCustomEvents: false };

    AlpineRayMagicMethod.initOnComponentInitialized(config, win, rayInstance);

    expect(testState.alpineComponentInitCallbacks.length).toBe(1);
});

it('logs component initializations', () => {
    const el = {
        $data: {
            $refs: {},
            one: 1,
        },
        $el: {
            outerHTML: '<em>test content</em>',
        },
    };

    rayInstance = new FakeRay();

    const config = { logComponentsInit: true, logCustomEvents: false };

    AlpineRayMagicMethod.initOnComponentInitialized(config, win, rayInstance);
    testState.alpineComponentInitCallbacks.forEach(cb => cb(el));

    expect(testState.rayPayloadHistory).toMatchSnapshot();
});

it('logs custom component events', () => {
    const el = {
        $data: {
            $refs: {},
            one: 1,
        },
        $el: {
            outerHTML: `<div x-data="{ foo: 'bar' }" x-on:custom-event="foo = 1" x-on:my-event-two="foo = 2"></div>`,
        },
    };

    rayInstance = new FakeRay();

    const config = { logComponentsInit: false, logCustomEvents: true };

    AlpineRayMagicMethod.initOnComponentInitialized(config, win, rayInstance);
    testState.alpineComponentInitCallbacks.forEach(cb => cb(el));
    testState.windowEventListeners.forEach(listener => {
        const event = {
            detail: { oneOne: 11 },
        };
        listener.callback(event);
    });

    expect(testState.rayPayloadHistory).toMatchSnapshot();
});

it('initializes defered loading of alpine', () => {
    AlpineRayMagicMethod.initDeferLoadingAlpine(win, rayInstance);

    let callbackCalls = 0;

    const callback = cb => {
        callbackCalls++;
    };

    win.deferLoadingAlpine(callback);

    expect(win.deferLoadingAlpine).not.toBeUndefined();
    expect(typeof win.deferLoadingAlpine).toBe('function');
    expect(callbackCalls).toBe(0);
});

it('initializes the object', () => {
    AlpineRayMagicMethod.init(win, rayInstance);

    testState.documentEventListeners.forEach(listener => listener.callback());

    expect(testState.documentEventListeners.length).toBe(1);
    expect(win.deferLoadingAlpine).not.toBeUndefined();
    expect(typeof win.deferLoadingAlpine).toBe('function');
});
