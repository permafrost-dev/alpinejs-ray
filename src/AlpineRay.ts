/* eslint-disable no-undef */

import { Ray } from 'node-ray/web';
import { SpruceRay } from './SpruceRay';

export class AlpineRay extends Ray {
    public static $version = '__BUILD_VERSION__';

    public spruceRay: SpruceRay | null = null;

    public spruce(): SpruceRay {
        if (this.spruceRay === null) {
            this.spruceRay = SpruceRay.create();
        }

        return <SpruceRay>this.spruceRay;
    }
}

export const ray = (...args: any[]) => {
    // @ts-ignore
    return AlpineRay.create().send(...args);
};

globalThis.ray = function (...args: any[]) {
    return ray(...args);
};

globalThis.AlpineRay = Ray;
