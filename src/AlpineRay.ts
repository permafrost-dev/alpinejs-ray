import { getWindow } from '@/lib/utils';
import { Ray } from 'node-ray/web';

export class AlpineRay extends Ray {
    public rayInstance: any;
    public trackRays: Record<string, any> = {
        store: {},
    };

    public window: Window | null = null;

    protected alpine(): any {
        return this.window?.Alpine;
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
            this.trackRays.store[name]?.table(data);
        });
    }

    public unwatchStore(name: string) {
        if (typeof this.trackRays.store[name] !== 'undefined') {
            delete this.trackRays.store[name];
        }
    }
}

export const ray = (...args: any[]) => AlpineRay.create().send(...args) as AlpineRay;

globalThis.ray = ray;
globalThis.AlpineRay = Ray;
