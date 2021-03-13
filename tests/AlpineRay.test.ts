/* eslint-disable no-undef */

import { AlpineRay } from '../src/AlpineRay';

it('has a version number', () => {
    expect(AlpineRay.$version).toBe('__BUILD_VERSION__');
});

it('returns an instance of the SpruceRay class', () => {
    const ar = new AlpineRay();
    expect(ar.spruce().constructor.name).toBe('SpruceRay');
});
