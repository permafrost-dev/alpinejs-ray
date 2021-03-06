import AlpineRayPlugin from './AlpineRayMagicMethod';

const initializeLibrary = () => {
    const alpineMethods = [AlpineRayPlugin];

    alpineMethods.forEach(am => {
        am.init();
    });
};

initializeLibrary();

export default AlpineRayPlugin;
