import { ray } from './AlpineRay';
import AlpineRayPlugin from './AlpineRayMagicMethod';
import { initializeLibrary } from './lib/initializeLibrary';
import { getWindow } from './lib/utils';

export { bootstrapImports } from './BootstrapImports';

initializeLibrary([AlpineRayPlugin], getWindow(), ray);

export default AlpineRayPlugin;
