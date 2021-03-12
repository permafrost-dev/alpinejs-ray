/*
import { Ray, ray } from 'node-ray/web';
import Alpine from 'alpinejs';
import AlpineRayPlugin from 'alpinejs-ray';

window.ray = ray;
window.Ray = Ray;
window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

window.Alpine = Alpine;
window.AlpineRayPlugin = AlpineRayPlugin;
window.AlpineRayPlugin.init();
window.AlpineRayPlugin.start();
*/

import { Ray, ray } from 'node-ray/web';
import axios from 'axios';
import AlpineRayPlugin from './index';
import { getWindow } from './lib/utils';
import { bootstrap } from './lib/bootstrap';

export const bootstrapImports = (Alpine: any, window: any = null) => {
    window = window ?? getWindow();

    return bootstrap({ Alpine, Ray, ray, axios, AlpineRayPlugin }, window);
};

export default bootstrapImports;
