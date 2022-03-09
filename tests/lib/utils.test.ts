/* eslint-disable no-undef */

import { checkForAlpine, checkForRay, isValidVersion } from '../../src/lib/utils';

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
});
