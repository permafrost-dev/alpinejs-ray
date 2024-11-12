/* eslint-disable no-undef */
import { expect, it } from 'vitest';
import {
    checkForAlpine,
    checkForAxios,
    checkForRay,
    encodeHtmlEntities,
    extractFunctionName,
    filterObjectKeys,
    findLiveViewName,
    findParentComponent,
    findWireID,
    getComponentName,
    highlightHtmlMarkup,
    isValidVersion,
} from '../../src/lib/utils';
import { FakeHTMLElement, generateFakeElements } from '../fakes/FakeHTMLElement';

it('throws an error if node-ray is not installed', () => {
    let error = null;

    try {
        checkForRay({});
    } catch (err: any) {
        error = err;
    }

    expect(error).not.toBeNull();
});

it('throws an error if node-ray is not initialized correctly', () => {
    let error = null;

    try {
        checkForRay({ Ray: {} });
    } catch (err: any) {
        error = err;
    }

    expect(error).not.toBeNull();
});

it('throws an error if alpine is not installed', () => {
    let error = null;

    try {
        checkForAlpine({});
    } catch (err: any) {
        error = err;
    }

    expect(error).not.toBeNull();
});

it('throws an error if alpine does not meet the minimum version', () => {
    const win = {
        Alpine: {
            version: '1.2.3',
        },
    };

    let error = null;

    try {
        checkForAlpine(win);
    } catch (err: any) {
        error = err;
    }

    expect(error).not.toBeNull();
});

it('does not throw an error if alpine meets the minimum version', () => {
    const win = {
        Alpine: {
            version: '5.0.0',
        },
    };

    expect(checkForAlpine(win)).toBeUndefined();
});

it('checks for valid version strings', () => {
    expect(isValidVersion('2.5.0', '3.1')).toBeTruthy();
    expect(isValidVersion('2.5.0', '3')).toBeTruthy();
    expect(isValidVersion('2.5.0', '2.4')).toBeFalsy();
    expect(isValidVersion('2.5.0', '1.2.3')).toBeFalsy();
    expect(isValidVersion('2.5.0', '3.2.1')).toBeTruthy();
    expect(isValidVersion('2.5.0', 'badversion')).toBeFalsy();
    expect(isValidVersion('2.5.0', '')).toBeFalsy();

    expect(isValidVersion('1.5.0', '3.3.2')).toBeTruthy();
    expect(isValidVersion('2.5.81', '3.1.2')).toBeTruthy();
});

it('checks that html syntax highlighting works', () => {
    const result = highlightHtmlMarkup('<div x-data="{test:1}" class="bg-red-400 p-1 rounded-md"><a @click="console.log(123);">Hello, world!</a></div>');
    expect(result).toMatchSnapshot();
});

it('gets the component name from various attributes', () => {
    const element = new FakeHTMLElement({ 'x-title': 'test-title' });
    expect(getComponentName(element as unknown as HTMLElement)).toBe('test-title');

    element.attributes = { 'x-id': 'test-id' };
    expect(getComponentName(element as unknown as HTMLElement)).toBe('test-id');

    element.id = 'test-id';
    expect(getComponentName(element as unknown as HTMLElement)).toBe('test-id');

    element.id = '';
    element.attributes = { name: 'test-name' };
    expect(getComponentName(element as unknown as HTMLElement)).toBe('test-name');

    element.attributes = { title: 'test-title-attr' };
    expect(getComponentName(element as unknown as HTMLElement)).toBe('test-title-attr');

    element.attributes = { 'aria-label': 'test-aria-label' };
    expect(getComponentName(element as unknown as HTMLElement)).toBe('test-aria-label');

    element.attributes = { 'x-data': 'testFunction()' };
    expect(getComponentName(element as unknown as HTMLElement)).toBe('testFunction');

    element.attributes = { role: 'test-role' };
    expect(getComponentName(element as unknown as HTMLElement)).toBe('test-role');

    element.attributes = {};
    element.tagName = 'span';
    expect(getComponentName(element as unknown as HTMLElement)).toBe('span');
});

it('finds the parent component with x-data attribute', () => {
    // const parent = new FakeHTMLElement({ 'x-data': 'parentData' });
    // const child = new FakeHTMLElement();
    // child.parentElement = parent;
    const el = generateFakeElements();
    const parent = el.parentElement;

    expect(findParentComponent(el as unknown as HTMLElement)).toBe(parent);
});

it('returns null if no parent component with x-data attribute is found', () => {
    const child = new FakeHTMLElement();
    expect(findParentComponent(child as unknown as HTMLElement)).toBeNull();
});
it('throws an error if axios is not installed', () => {
    let error = null;

    try {
        checkForAxios({} as unknown as Window);
    } catch (err: any) {
        error = err;
    }

    expect(error).not.toBeNull();
});

it('does not throw an error if axios is installed', () => {
    const win = {
        axios: {},
    };

    expect(checkForAxios(win as unknown as Window)).toBeUndefined();
});

it('encodes HTML entities correctly', () => {
    const str = '<div class="test">Hello & welcome!</div>';

    expect(encodeHtmlEntities(str)).toMatchSnapshot();
});

it('filters object keys correctly', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const ignoreKeys = ['b'];
    const filteredObj = filterObjectKeys(obj, ignoreKeys);

    expect(filteredObj).toEqual({ a: 1, c: 3 });
});

it('finds wire ID correctly', () => {
    const wireId = 'test-wire-id';
    const win = {
        livewire: {
            find: id => ({
                __instance: {
                    fingerprint: {
                        name: 'test-name',
                    },
                },
            }),
        },
    };

    expect(findWireID(wireId, win)).toBe('livewire:test-name');
});

it('returns undefined if wire ID is not found', () => {
    const wireId = 'test-wire-id';
    const win = {
        livewire: {
            find: id => null,
        },
    };

    expect(findWireID(wireId, win)).toBeUndefined();
});

it('finds LiveView name correctly', () => {
    const alpineEl = {
        closest: () => ({
            dataset: {
                phxView: 'test-view',
            },
        }),
    };
    const win = {
        liveSocket: {
            getViewByEl: el => ({
                name: 'test-view-name',
            }),
        },
    };

    expect(findLiveViewName(alpineEl, win)).toBe('test-view-name');
});

it('returns undefined if LiveView name is not found', () => {
    const alpineEl = {
        closest: () => null,
    };
    const win = {
        liveSocket: {
            getViewByEl: el => null,
        },
    };

    expect(findLiveViewName(alpineEl, win)).toBeUndefined();
});

it('extracts function name correctly', () => {
    expect(extractFunctionName('testFunction()')).toBe('testFunction');
    expect(extractFunctionName('testFunction(param)')).toBe('testFunction');
    expect(extractFunctionName('{testFunction}')).toBe('');
    expect(extractFunctionName('')).toBe('');
});

it('finds parent component with x-data attribute', () => {
    const parent = new FakeHTMLElement({ 'x-data': 'parentData' });
    const child = new FakeHTMLElement();
    child.parentElement = parent;

    expect(findParentComponent(child as unknown as HTMLElement)).toBe(parent);
});

it('returns null if no parent component with x-data attribute is found', () => {
    const child = new FakeHTMLElement();
    expect(findParentComponent(child as unknown as HTMLElement)).toBeNull();
});
