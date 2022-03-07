import { addErrorEventHandlers } from '../ErrorHandlers';
import { getAlpineRayConfig, AlpineRayConfig } from '@/AlpineRayConfig';
import { getWindow } from './utils';
import { ray } from '../AlpineRay';

export class LibraryInitializer {
    public plugins: any[];

    public window: any;

    public rayInstance: any;

    public config: AlpineRayConfig;

    constructor(plugins: any[], window: any = null, rayInstance: any = null) {
        this.plugins = plugins;
        this.window = window ?? getWindow();
        this.rayInstance = rayInstance ?? ray();
        this.config = getAlpineRayConfig(this.window);
    }

    public static create(plugins: any[], window: any = null, rayInstance: any = null) {
        return new LibraryInitializer(plugins, window, rayInstance);
    }

    public init() {
        return this.initPlugins().initErrorHandlers();
    }

    public initPlugins() {
        this.plugins.forEach(am => {
            am.init(this.window, this.rayInstance);
        });

        return this;
    }

    public initErrorHandlers() {
        if (this.config.interceptErrors) {
            addErrorEventHandlers(this.window, this.rayInstance);
        }

        return this;
    }
}
