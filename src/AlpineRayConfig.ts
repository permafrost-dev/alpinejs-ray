import { getWindow } from './lib/utils';

export interface AlpineRayConfig {
    interceptErrors?: boolean;
    logComponentsInit?: boolean;
    logCustomEvents?: boolean;
    logEvents?: boolean | string[];
}

export function getAlpineRayConfig(window: any = null): AlpineRayConfig {
    window = window ?? getWindow();

    const config: AlpineRayConfig = window.alpineRayConfig || {};

    return {
        interceptErrors: config?.interceptErrors || false,
        logComponentsInit: config?.logComponentsInit || false,
        logCustomEvents: config?.logCustomEvents || false,
    };
}
