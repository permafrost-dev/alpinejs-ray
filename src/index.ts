import { ray } from './AlpineRay';
import AlpineRayPlugin from './AlpineRayMagicMethod';
import { initializeLibrary } from './lib/initializeLibrary';
import { getWindow } from './lib/utils';

initializeLibrary([AlpineRayPlugin], getWindow(), ray());

export default AlpineRayPlugin;
