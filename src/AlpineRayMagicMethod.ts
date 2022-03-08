import { ray } from '@/AlpineRay';
import { AlpineRayConfig, getAlpineRayConfig } from '@/AlpineRayConfig';
import { checkForAxios, getWindow } from '@/lib/utils';

const AlpineRayMagicMethod = {
    initCustomEventListeners(config: AlpineRayConfig | Record<string, any> | null = null, window: any = null, rayInstance: any = null) {
        config = config ?? getAlpineRayConfig(window);

        if (Array.isArray(config?.logEvents || false)) {
            const eventRegex = new RegExp(/(?:@|x-on:)([\w-_.]+)=/g);
            const html: string = window.document.querySelector('body').outerHTML;
            const matches = html.matchAll(eventRegex);
            const eventNames: string[] = [];

            for (const match of matches) {
                eventNames.push(match[1]);
            }

            eventNames.forEach(name => {
                if (!config?.logEvents.includes(name) && !config?.logEvents.includes('*')) {
                    return;
                }

                const nameParts = name.split('.');
                const eventName: string = nameParts[0] ?? name;
                const lastNamePart = nameParts[nameParts.length - 1];

                window.addEventListener(eventName, e => {
                    if (eventName.includes('-') || (nameParts.length === 2 && lastNamePart === 'window')) {
                        rayInstance.table(
                            {
                                event: name,
                                payload: e.detail ?? null,
                            },
                            'alpine.js',
                        );
                    }
                });
            });
        }
    },

    init(config: AlpineRayConfig | Record<string, any> | null = null, window: any = null, rayInstance: any = null) {
        window = window ?? getWindow();
        config = config ?? getAlpineRayConfig(window);
        rayInstance = rayInstance ?? ray;

        AlpineRayMagicMethod.initCustomEventListeners(config, window, rayInstance);

        return AlpineRayMagicMethod;
    },

    register(Alpine: any = null, window: any = null) {
        window = window ?? getWindow();
        Alpine = Alpine ?? window.Alpine;

        checkForAxios(window ?? getWindow());

        //Alpine.directive('ray', () => {});

        Alpine.magic(
            'ray',
            () =>
                (...params: any) =>
                    ray(...params),
        );
    },
};

export default AlpineRayMagicMethod;
