/* eslint-disable no-undef */

export class SpruceRay {
    public spruceInstance: any;
    public rayInstance: any;
    public trackRays: Record<string, any> = {};

    public constructor(rayFunc: any = null, spruceInstance: any = null) {
        this.rayInstance = rayFunc ?? globalThis.ray;
        this.spruceInstance = spruceInstance ?? globalThis.Spruce;
    }

    public static create(rayInstance: any = null, spruceInstance: any = null): SpruceRay {
        return new SpruceRay(rayInstance, spruceInstance);
    }

    protected init() {
        this.rayInstance = this.rayInstance ?? globalThis.ray() ?? null;
        this.spruceInstance = this.spruceInstance ?? globalThis.Spruce ?? null;
    }

    public hasSpruceInstallation() {
        return this.spruceInstance !== null;
    }

    protected isValidWatchName(name: string): boolean {
        return name.length > 0 && name.includes('.');
    }

    public watch(name: string) {
        if (!this.hasSpruceInstallation()) {
            return;
        }

        if (!this.isValidWatchName(name)) {
            return;
        }

        this.init();

        if (typeof this.trackRays[name] === 'undefined') {
            this.trackRays[name] = this.rayInstance;
        }

        this.spruceInstance.watch(name, value => {
            if (typeof this.trackRays[name] !== 'undefined') {
                const title = 'Spruce Watched Property Change';
                this.trackRays[name].table({ title, name, value });
            }
        });
    }

    public unwatch(name: string) {
        if (!this.hasSpruceInstallation()) {
            return;
        }

        if (!this.isValidWatchName(name)) {
            return;
        }

        this.init();

        if (typeof this.trackRays[name] !== 'undefined') {
            delete this.trackRays[name];
        }
    }
}

export default SpruceRay;
