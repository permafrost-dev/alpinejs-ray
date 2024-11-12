 

import { Ray } from 'node-ray/web';
import { getWindow } from '@/lib/utils';

export class AlpineRay extends Ray {
    public rayInstance: any;
    public trackRays: Record<string, any> = {
        store: {},
    };

    public window: any = null;

    protected alpine(): any {
        return this.window.Alpine;
    }

    public init(rayInstance: any = null, window: any = null) {
        this.rayInstance = rayInstance ?? this.rayInstance ?? globalThis.ray() ?? ray();
        this.window = window ?? this.window ?? getWindow();
    }

    public watchStore(name: string) {
        this.init();

        if (typeof this.trackRays.store[name] === 'undefined') {
            this.trackRays.store[name] = this.rayInstance ?? globalThis.ray() ?? ray();
        }

        const data = this.alpine().store(name);

        this.alpine().effect(() => {
            this.trackRays.store[name].table(data);
        });
    }

    public unwatchStore(name: string) {
        if (typeof this.trackRays.store[name] !== 'undefined') {
            delete this.trackRays.store[name];
        }
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
