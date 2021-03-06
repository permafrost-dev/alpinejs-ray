import { checkForRay } from './lib/utils';
import AlpineRayMagicMethod from './AlpineRayMagicMethod';

const alpineMethods = [AlpineRayMagicMethod];

const initializeLibrary = () => {
    checkForRay();

    alpineMethods.forEach(am => {
        am.init();
    });
};

initializeLibrary();

export default AlpineRayMagicMethod;
