/* eslint-disable no-undef */

import { Ray } from 'node-ray/web';

export class AlpineRay extends Ray {
    public static $version = '__BUILD_VERSION__';
}

export const ray = (...args: any[]) => {
    // @ts-ignore
    return Ray.create().send(...args);
};

globalThis.ray = function (...args: any[]) {
    return ray(...args);
};

globalThis.AlpineRay = Ray;
