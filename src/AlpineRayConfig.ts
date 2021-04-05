import { getWindow } from './lib/utils';

export interface AlpineRayConfig {
    interceptErrors?: boolean;
    interceptSpruce?: boolean;
    logComponentsInit?: boolean;
    logCustomEvents?: boolean;
}

export function getAlpineRayConfig(window: any = null): AlpineRayConfig {
    window = window ?? getWindow();

    const config: AlpineRayConfig = window.alpineRayConfig || {};

    return {
        interceptErrors: config?.interceptErrors || false,
        interceptSpruce: config?.interceptSpruce || false,
        logComponentsInit: config?.logComponentsInit || false,
        logCustomEvents: config?.logCustomEvents || false,
    };
}
