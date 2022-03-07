import { ray } from './AlpineRay';
import { checkForAxios, getWindow } from './lib/utils';

export default function (Alpine: any, window: any = null) {
    checkForAxios(window ?? getWindow());

    //Alpine.directive('ray', () => {});
    Alpine.magic('ray', (...params: any) => ray(...params));
}
