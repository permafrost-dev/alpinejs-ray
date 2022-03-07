import { ray } from '../AlpineRay';
import { getAlpineRayConfig } from '../AlpineRayConfig';
import { addErrorEventHandlers } from '../ErrorHandlers';
import { getWindow } from '../lib/utils';

export const initializeLibrary = (plugins: any[], window: any = null, rayInstance: any = null) => {
    window = window ?? getWindow();
    rayInstance = rayInstance ?? ray();

    initializePlugins(plugins, window, rayInstance);
    initializeErrorEventHandlers(window, rayInstance);
};

export const initializePlugins = (plugins: any[], window: any = null, rayInstance: any = null) => {
    window = window ?? getWindow();
    rayInstance = rayInstance ?? ray();

    plugins.forEach(am => {
        am.init(window, rayInstance);
    });
};

export const initializeErrorEventHandlers = (window: any = null, rayInstance: any = null) => {
    window = window ?? getWindow();
    rayInstance = rayInstance ?? ray();

    const config = getAlpineRayConfig(window);

    if (config.interceptErrors) {
        addErrorEventHandlers(window, rayInstance);
    }
};
