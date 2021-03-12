/* eslint-disable no-undef */
import { bootstrap } from '../../src/lib/bootstrap';

it('bootstraps alpinejs-ray imports for a bundler', () => {
    let win = {};
    const Alpine = 'AlpineClass';
    const Ray = 'RayClass';
    const ray = 'rayHelper';
    const axios = {
        defaults: {
            headers: {
                common: {},
            },
        },
    };
    const AlpineRayPlugin = {
        initRunCount: 0,
        init() {
            this.initRunCount += 1;
        },
    };

    const result: any = bootstrap({ Alpine, AlpineRayPlugin, Ray, ray, axios }, win);

    expect(AlpineRayPlugin.initRunCount).toBe(1);
    expect(result).toBe(AlpineRayPlugin);
    expect(win).toMatchSnapshot();
});
