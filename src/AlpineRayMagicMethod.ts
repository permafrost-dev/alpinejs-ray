/* eslint-disable no-undef */

import { getWindow, checkForAlpine, checkForAxios, highlightHtmlMarkup, filterObjectKeys } from './lib/utils';
import { ray } from './AlpineRay';
import { getAlpineRayConfig, AlpineRayConfig } from './AlpineRayConfig';

const AlpineRayMagicMethod = {
    initOnDocumentReady(window: any = null) {
        window = window ?? getWindow();

        window.document.addEventListener('readystatechange', () => {
            if (window.document.readyState === 'ready') {
                window.deferLoadingAlpine();
            }
        });
    },

    initDeferLoadingAlpine(window: any = null, rayInstance: any = null) {
        window = window ?? getWindow();
        rayInstance = rayInstance ?? ray;

        const config = getAlpineRayConfig(window);
        const alpine = window.deferLoadingAlpine || ((alpine: any) => alpine());

        window.deferLoadingAlpine = function (callback: CallableFunction) {
            AlpineRayMagicMethod.initOnComponentInitialized(config, window, rayInstance);
            AlpineRayMagicMethod.start(window, rayInstance);

            alpine(callback);
        };
    },

    initOnComponentInitialized(config: AlpineRayConfig | Record<string, unknown>, window: any = null, rayInstance: any = null) {
        window.Alpine.onComponentInitialized(el => {
            if (config.logComponentsInit ?? false) {
                rayInstance.table(
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
                    const eventName: string = nameParts[0] ?? name;
                    const lastNamePart = nameParts[nameParts.length - 1];

                    window.addEventListener(eventName, e => {
                        if (eventName.includes('-') || (nameParts.length === 2 && lastNamePart === 'window')) {
                            rayInstance.table({
                                event: name,
                                payload: e.detail ?? null,
                            });
                        }
                    });
                });
            }
        });
    },

    init(window: any = null, rayInstance: any = null) {
        window = window ?? getWindow();
        rayInstance = rayInstance ?? ray;

        AlpineRayMagicMethod.initOnDocumentReady(window);
        AlpineRayMagicMethod.initDeferLoadingAlpine(window, rayInstance);
    },

    start(window: any = null, rayInstance: any = null) {
        window = window ?? getWindow();
        rayInstance = rayInstance ?? ray;

        checkForAxios(window);
        checkForAlpine(window);

        window.Alpine.addMagicProperty('ray', () => rayInstance);
    },
};

export default AlpineRayMagicMethod;
