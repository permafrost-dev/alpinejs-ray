import { ray } from './AlpineRay';
import AlpineRayPlugin from './AlpineRayMagicMethod';
import { addErrorEventHandlers } from './ErrorHandlers';
import { getWindow } from './lib/utils';
import { SpruceProxy } from './SpruceProxy';

const initializeLibrary = () => {
    const alpineMethods = [AlpineRayPlugin];

    alpineMethods.forEach(am => {
        am.init();
    });

    addErrorEventHandlers(getWindow(), ray());

    // conditional Spruce proxy/monitor
    new SpruceProxy(getWindow(), ray()).init();
};

initializeLibrary();

export default AlpineRayPlugin;
