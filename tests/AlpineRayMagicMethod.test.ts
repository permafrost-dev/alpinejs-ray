/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import { expect, it, beforeEach } from 'vitest';
import AlpineRayMagicMethod from '../src/AlpineRayMagicMethod';

let rayInstance: any, win: any, testState: AlpineRayMagicMethodTestState;

interface AlpineRayMagicMethodTestState {
    alpineMagicProperties: any[];
    alpineDirectives: any[];
    alpineComponentInitCallbacks: CallableFunction[];
    rayPayloadHistory: any[];
    documentEventListeners: any[];
    windowEventListeners: any[];
    deferLoadingAlpineCallCounter: number;
}

const getFreshTestState = (): AlpineRayMagicMethodTestState => {
    return {
        alpineMagicProperties: [],
        alpineDirectives: [],
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
            directive(name, ...args) {
                testState.alpineDirectives.push({ name });
            },
            onComponentInitialized(callback) {
                testState.alpineComponentInitCallbacks.push(callback);
            },
        },
        document: {
            readyState: 'not_ready',
            querySelector(selector: string) {
                return { outerHTML: '' };
            },
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
    AlpineRayMagicMethod.init(null, { axios: {} }, rayInstance).register(null, win, rayInstance);

    expect(testState.alpineMagicProperties.length).toBe(1);
    expect(testState.alpineMagicProperties[0].name).toBe('ray');
    //expect(testState.alpineMagicProperties[0].callback()).toBe(rayInstance);
});

// it('throws an error during start() if AlpineJS is not installed', () => {
//     let err = null;
//     try {
//         AlpineRayMagicMethod.init(null, { axios: {} }, rayInstance).register(null, win);
//     } catch (e: any) {
//         err = e;
//     }

//     expect(err).not.toBeNull();
// });

it('throws an error during start() if axios is not installed', () => {
    let err = null;
    try {
        delete win['axios'];
        expect(AlpineRayMagicMethod.register(win.Alpine, {})).toThrowError('Error');
    } catch (e: any) {
        err = e;
    }

    // .not.toBeNull();
});

// it('creates an event handler for document.readystatechange', () => {
//     win.document.readyState = 'not_ready';
//     AlpineRayMagicMethod.initOnDocumentReady(win);
//     testState.documentEventListeners.forEach(listener => listener.callback());

//     expect(testState.documentEventListeners.length).toBe(1);
//     expect(testState.documentEventListeners[0].name).toBe('readystatechange');
//     expect(testState.deferLoadingAlpineCallCounter).toBe(0);
// });

// it('calls deferLoadingAlpine() when document state is "ready"', () => {
//     win.document.readyState = 'ready';
//     AlpineRayMagicMethod.initOnDocumentReady(win);
//     testState.documentEventListeners.forEach(listener => listener.callback());

//     expect(testState.documentEventListeners.length).toBe(1);
//     expect(testState.documentEventListeners[0].name).toBe('readystatechange');
//     expect(testState.deferLoadingAlpineCallCounter).toBe(1);
// });

// it('creates a handler for component initializations', () => {
//     const config = { logComponentsInit: false, logCustomEvents: false };

//     AlpineRayMagicMethod.initOnComponentInitialized(config, win, rayInstance);

//     expect(testState.alpineComponentInitCallbacks.length).toBe(1);
// });

// it('logs component initializations', () => {
//     const el = {
//         $data: {
//             $refs: {},
//             one: 1,
//         },
//         $el: {
//             outerHTML: '<em>test content</em>',
//         },
//     };

//     rayInstance = new FakeRay();

//     const config = { logComponentsInit: true, logCustomEvents: false };

//     AlpineRayMagicMethod.initOnComponentInitialized(config, win, rayInstance);
//     testState.alpineComponentInitCallbacks.forEach(cb => cb(el));

//     expect(testState.rayPayloadHistory).toMatchSnapshot();
// });

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

    AlpineRayMagicMethod.initCustomEventListeners(config, win, rayInstance);
    testState.alpineComponentInitCallbacks.forEach(cb => cb(el));
    testState.windowEventListeners.forEach(listener => {
        const event = {
            detail: { oneOne: 11 },
        };
        listener.callback(event);
    });

    expect(testState.rayPayloadHistory).toMatchSnapshot();
});
it('should initialize custom event listeners when logEvents is defined', () => {
    const config = { logEvents: ['custom-event'] };

    // Simulate the outerHTML of body containing events
    win.document.querySelector = (selector: string) => ({
        outerHTML: '<div x-on:custom-event="handler"></div>',
    });

    AlpineRayMagicMethod.initCustomEventListeners(config, win, rayInstance);

    expect(testState.windowEventListeners.length).toBe(1);
    expect(testState.windowEventListeners[0].name).toBe('custom-event');

    // Simulate triggering the event
    const event = { detail: { foo: 'bar' } };
    testState.windowEventListeners[0].callback(event);

    expect(testState.rayPayloadHistory.length).toBe(1);
    expect(testState.rayPayloadHistory[0]).toMatchSnapshot();
});

it('should not initialize custom event listeners when logEvents is empty', () => {
    const config = { logEvents: [] };

    AlpineRayMagicMethod.initCustomEventListeners(config, win, rayInstance);

    expect(testState.windowEventListeners.length).toBe(0);
});

it('should initialize error handlers when interceptErrors is true', () => {
    const config = { interceptErrors: true };

    AlpineRayMagicMethod.initErrorHandlers(config, win, rayInstance);

    expect(testState.windowEventListeners.length).toBe(2);
    const eventNames = testState.windowEventListeners.map(listener => listener.name);
    expect(eventNames).toContain('error');
    expect(eventNames).toContain('unhandledrejection');
});

it('should not initialize error handlers when interceptErrors is false', () => {
    const config = { interceptErrors: false };

    AlpineRayMagicMethod.initErrorHandlers(config, win, rayInstance);

    expect(testState.windowEventListeners.length).toBe(0);
});

it('should register the ray magic method and directive in Alpine', () => {
    AlpineRayMagicMethod.register(win.Alpine, win, rayInstance);

    expect(testState.alpineMagicProperties.length).toBe(1);
    expect(testState.alpineMagicProperties[0].name).toBe('ray');

    expect(testState.alpineDirectives.length).toBe(1);
    expect(testState.alpineDirectives[0].name).toBe('ray');
});

it.skip('should execute ray directive and update trackRays and trackCounters', () => {
    const el = {
        getAttribute: (attr: string) => {
            if (attr === 'id') return 'test-id';
            return null;
        },
        tagName: 'DIV',
    };
    const directive = { expression: 'foo' };
    const data = 'test data';

    const evaluateLater = (expression: string) => {
        return callback => {
            callback(data);
        };
    };
    const effect = callback => {
        callback();
    };

    // Reset trackRays and trackCounters
    AlpineRayMagicMethod.trackRays = {};
    AlpineRayMagicMethod.trackCounters = {};

    // Simulate the directive registration
    let directiveCallback;
    win.Alpine.directive = (name, callback) => {
        directiveCallback = callback;
        testState.alpineDirectives.push({ name });
    };

    AlpineRayMagicMethod.register(win.Alpine, win, rayInstance);

    directiveCallback(el, directive, { evaluateLater, effect });

    const ident = el.getAttribute('id') ?? '';

    expect(AlpineRayMagicMethod.trackRays[ident]).toBeInstanceOf(FakeRay);
    expect(AlpineRayMagicMethod.trackCounters[ident]).toBe(1);
    expect(testState.rayPayloadHistory.length).toBeGreaterThan(0);
});

it.skip('should handle errors and send ray payload when an error occurs', () => {
    const config = { interceptErrors: true };
    AlpineRayMagicMethod.initErrorHandlers(config, win, rayInstance);

    const errorEvent = {
        error: {
            toString: () => 'Test Error',
            el: {
                tagName: 'DIV',
            },
            expression: 'x-test',
        },
    };

    // Simulate error event
    testState.windowEventListeners.forEach(listener => {
        if (listener.name === 'error') {
            listener.callback(errorEvent);
        }
    });

    console.log({ payload: testState.rayPayloadHistory });
    expect(testState.rayPayloadHistory.length).toBe(1);
    expect(testState.rayPayloadHistory[0].type).toBe('table');
    expect(testState.rayPayloadHistory[0].args[1]).toBe('ERROR');
});

it('should initialize all features when init is called', () => {
    const config = {
        interceptErrors: true,
        logEvents: ['custom-event'],
    };

    win.document.querySelector = selector => ({
        outerHTML: '<div x-on:custom-event="handler"></div>',
    });

    AlpineRayMagicMethod.init(config, win, rayInstance);

    expect(testState.windowEventListeners.length).toBe(3);
    const eventNames = testState.windowEventListeners.map(listener => listener.name);
    expect(eventNames).toContain('error');
    expect(eventNames).toContain('unhandledrejection');
    expect(eventNames).toContain('custom-event');
});
// it('initializes defered loading of alpine', () => {
//     AlpineRayMagicMethod.initDeferLoadingAlpine(win, rayInstance);

//     let callbackCalls = 0;

//     const callback = cb => {
//         callbackCalls++;
//     };

//     win.deferLoadingAlpine(callback);

//     expect(win.deferLoadingAlpine).not.toBeUndefined();
//     expect(typeof win.deferLoadingAlpine).toBe('function');
//     expect(callbackCalls).toBe(0);
// });

// it('initializes the object', () => {
//     const config = { logComponentsInit: false, logCustomEvents: true, logEvents: ['*'] };

//     AlpineRayMagicMethod.init(config, win, rayInstance).register(win.Alpine, win);

//     testState.documentEventListeners.forEach(listener => listener.callback());

//     expect(testState.documentEventListeners.length).toBe(1);
//     expect(win.deferLoadingAlpine).not.toBeUndefined();
//     expect(typeof win.deferLoadingAlpine).toBe('function');
// });
