import { ray } from './AlpineRay';
import AlpineRayPlugin from './AlpineRayMagicMethod';
import { LibraryInitializer } from './lib/LibraryInitializer';
import { getWindow } from './lib/utils';

LibraryInitializer.create([AlpineRayPlugin], getWindow(), ray).init();

export default AlpineRayPlugin;
