/* eslint-disable no-undef */

import { getWindow, checkForAlpine, checkForAxios, highlightHtmlMarkup, filterObjectKeys } from './lib/utils';
import { ray } from './AlpineRay';

const AlpineRayMagicMethod = {
    initOnDocumentReady() {
        getWindow().document.addEventListener('readystatechange', () => {
            if (getWindow().document.readyState === 'ready') {
                getWindow().deferLoadingAlpine();
            }
        });
    },

    init() {
        AlpineRayMagicMethod.initOnDocumentReady();

        const config = getWindow().alpineRayConfig || {};
        const alpine = getWindow().deferLoadingAlpine || ((alpine: any) => alpine());

        getWindow().deferLoadingAlpine = function (callback: CallableFunction) {
            if (config.logComponentsInit ?? false) {
                getWindow().Alpine.onComponentInitialized(el => {
                    ray().table(
                        {
                            'component event': 'component init',
                            data: filterObjectKeys(el.$data, ['$el', '$watch', '$refs', '$nextTick']),
                            HTML: `<code class="text-sm text-black">${highlightHtmlMarkup(el.$el.outerHTML)}</code>`,
                        },
                        'alpine.js'
                    );
                });
            }

            AlpineRayMagicMethod.start();

            alpine(callback);
        };
    },

    start() {
        checkForAxios();
        checkForAlpine();

        getWindow().Alpine.addMagicProperty('ray', () => ray);
    },
};

export default AlpineRayMagicMethod;
