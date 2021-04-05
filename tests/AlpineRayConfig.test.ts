/* eslint-disable no-undef */

import { AlpineRayConfig, getAlpineRayConfig } from '../src/AlpineRayConfig';

it('uses default values when no config object exists', () => {
    const config: AlpineRayConfig = getAlpineRayConfig({});

    expect(config.logComponentsInit).toBeFalsy();
    expect(config.logCustomEvents).toBeFalsy();
    expect(config.interceptErrors).toBeFalsy();
    expect(config.interceptSpruce).toBeFalsy();
});

it('loads the values from the global config object', () => {
    const config: AlpineRayConfig = getAlpineRayConfig({
        alpineRayConfig: {
            logComponentsInit: true,
            logCustomEvents: true,
        },
    });

    expect(config.logComponentsInit).toBeTruthy();
    expect(config.logCustomEvents).toBeTruthy();
    expect(config.interceptErrors).toBeFalsy();
    expect(config.interceptSpruce).toBeFalsy();
});
