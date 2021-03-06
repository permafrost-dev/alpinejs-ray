/* eslint-disable no-undef */

import { getWindow, checkForAlpine, encodeHtmlEntities } from './lib/utils';

const AlpineRayMagicMethod = {
    initOnDocumentReady() {
        getWindow().document.addEventListener('readystatechange', () => {
            if (getWindow().document.readyState === 'ready') {
                getWindow().deferLoadingAlpine();
            }
        });
    },

    init() {
        console.log('initialized AlpineRayMagicMethod');

        AlpineRayMagicMethod.initOnDocumentReady();

        const config = getWindow().alpineRayConfig || {};
        const alpine = getWindow().deferLoadingAlpine || ((alpine: any) => alpine());

        getWindow().deferLoadingAlpine = function (callback: CallableFunction) {
            if (config.logComponentsInit ?? false) {
                getWindow().Alpine.onComponentInitialized(el => {
                    const ray = getWindow().Ray.ray;

                    const dataObj = {};

                    // don't display some alpine props within el.$data
                    Object.keys(el.$data)
                        .filter(key => !['$el', '$watch', '$refs', '$nextTick'].includes(key))
                        .forEach(key => {
                            dataObj[key] = el.$data[key];
                        });

                    const element = {
                        data: dataObj,
                        innerHTML: encodeHtmlEntities(el.$el.innerHTML),
                    };

                    ray().table({ 'component init': element });
                });
            }

            AlpineRayMagicMethod.start();

            alpine(callback);
        };
    },

    start() {
        console.log('started AlpineRayMagicMethod');

        checkForAlpine();

        const Alpine = getWindow().Alpine;

        Alpine.addMagicProperty('ray', () => {
            return (...parameters: any[]) => {
                return getWindow()
                    .Ray.Ray.create()
                    .send(...parameters);
            };
        });
    },
};

export default AlpineRayMagicMethod;
