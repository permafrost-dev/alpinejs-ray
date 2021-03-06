//import { checkForRay } from './lib/utils';
import AlpineRayPlugin from './AlpineRayMagicMethod';

const alpineMethods = [AlpineRayPlugin];

const initializeLibrary = () => {
    alpineMethods.forEach(am => {
        am.init();
    });
};

initializeLibrary();

export default AlpineRayPlugin;
