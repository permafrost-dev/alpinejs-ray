/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { getWindow } from './lib/utils';
import { ray } from './AlpineRay';

const trackRays = {};

export class SpruceProxy {
    public spruceInstance: any = null;
    public window: any;
    public rayInstance: any;

    constructor(window: any = null, rayInstance: any = null) {
        this.window = window ?? getWindow();
        this.rayInstance = rayInstance ?? ray();
        this.spruceInstance = this.window.Spruce;
    }

    public checkForSpruce() {
        if (!this.hasSpruceInstallation()) {
            throw new Error('[alpinejs-ray] Spruce must be installed to use the SpruceProxy.');
        }
    }

    public hasSpruceInstallation() {
        return typeof this.window['Spruce'] !== 'undefined';
    }

    public spruce() {
        return this.spruceInstance;
    }

    public init() {
        if (this.hasSpruceInstallation()) {
            this.checkForSpruce();

            this.spruceInstance = this.window.Spruce;
            this.window.SpruceProxy = this;

            this.interceptStoreCreation();
        }
    }

    public interceptStoreCreation() {
        const displayTracking = this.displayTracking;

        const proxyHandler: ProxyHandler<any> = {
            get(target, key) {
                if (typeof target[key] === 'undefined' || !(<string>key ?? '').length) {
                    return;
                }

                displayTracking(<string>key, 'read/write', target[<string>key]);

                return target[key];
            },
            set(target, key, value) {
                if (!(<string>key ?? '').length) {
                    return false;
                }

                target[key] = value;

                displayTracking(<string>key, 'created', value);

                return true;
            },
        };

        this.window.Spruce.stores = new Proxy(this.window.Spruce.stores, proxyHandler);
    }

    public displayTracking(key: string, action: string, value: any) {
        if (typeof trackRays[<string>key] === 'undefined') {
            trackRays[<string>key] = this?.rayInstance() ?? ray();
        }

        const data = {
            title: `Spruce Store`,
            name: key,
            action: action,
            updated: new Date().getTime(),
            target: value,
        };

        trackRays[key] = trackRays[key].table(data);
    }

    public dumpStore(name: string) {
        const rayInstance = this?.rayInstance ?? ray;
        rayInstance().table(this.spruceInstance.stores[name]);
    }

    public dumpAllStores() {
        const rayInstance = this?.rayInstance ?? ray;
        rayInstance().table(this.spruceInstance.stores);
    }
}
