interface BootstrapParameters {
    AlpineRayPlugin: any;
    ray: any;
    Ray: any;
    axios: any;
    Alpine: any;
}

import { getWindow } from './utils';

export const bootstrap = (params: BootstrapParameters, window: any = null) => {
    //({ plugin, ray, Ray, axios, Alpine, window }) => {
    window = window ?? getWindow();

    for (const prop in params) {
        window[prop] = params[prop];
    }

    window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    window.AlpineRayPlugin.init();

    return window.AlpineRayPlugin;
};
