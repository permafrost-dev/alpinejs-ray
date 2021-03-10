import { ray } from '../AlpineRay';
import { addErrorEventHandlers } from '../ErrorHandlers';
import { getWindow } from '../lib/utils';
import { SpruceProxy } from '../SpruceProxy';

export const initializeLibrary = (plugins: any[], window: any = null, rayInstance: any = null) => {
    window = window ?? getWindow();
    rayInstance = rayInstance ?? ray();

    initializePlugins(plugins, window, rayInstance);
    initializeErrorEventHandlers(window, rayInstance);
    initializeSpruce(window, rayInstance);
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

    addErrorEventHandlers(window, rayInstance);
};

export const initializeSpruce = (window: any = null, rayInstance: any = null) => {
    window = window ?? getWindow();
    rayInstance = rayInstance ?? ray();

    // conditional Spruce proxy/monitor
    new SpruceProxy(window, rayInstance).init();
};
