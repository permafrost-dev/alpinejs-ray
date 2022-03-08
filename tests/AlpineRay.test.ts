/* eslint-disable no-undef */

import { AlpineRay } from '../src/AlpineRay';

it('has a version number', () => {
    expect(AlpineRay.$version).toBe('__BUILD_VERSION__');
});
