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
            getWindow().Alpine.onComponentInitialized(el => {
                if (config.logComponentsInit ?? false) {
                    ray().table(
                        {
                            'component event': 'component init',
                            data: filterObjectKeys(el.$data, ['$el', '$watch', '$refs', '$nextTick']),
                            HTML: `<code class="text-sm text-black">${highlightHtmlMarkup(el.$el.outerHTML)}</code>`,
                        },
                        'alpine.js'
                    );
                }

                if (config.logCustomEvents ?? false) {
                    const eventRegex = new RegExp(/(?:@|x-on:)([\w-_.]+)=/g);
                    const html: string = el.$el.outerHTML;
                    const matches = html.matchAll(eventRegex);
                    const eventNames: string[] = [];

                    for (const match of matches) {
                        eventNames.push(match[1]);
                    }

                    eventNames.forEach(name => {
                        const nameParts = name.split('.');
                        const eventName: string = nameParts[0] ?? name; //name.split('.').shift() ?? name;
                        const lastNamePart = nameParts[nameParts.length - 1];

                        getWindow().addEventListener(eventName, e => {
                            if (eventName.includes('-') || (nameParts.length === 2 && lastNamePart === 'window')) {
                                ray().table({
                                    event: name,
                                    payload: e.detail ?? null,
                                    targetTag: e.target.localName,
                                    targetText: e.target.innerText,
                                    sourceText: e.srcElement.innerText,
                                });
                            }
                        });
                    });
                }
            });

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
