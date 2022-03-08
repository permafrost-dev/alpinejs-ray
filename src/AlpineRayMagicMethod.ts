import { ray } from '@/AlpineRay';
import { AlpineRayConfig, getAlpineRayConfig } from '@/AlpineRayConfig';
import { checkForAxios, encodeHtmlEntities, filterObjectKeys, findParentComponent, getWindow, highlightHtmlMarkup } from '@/lib/utils';

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

    initErrorHandlers(config: AlpineRayConfig | Record<string, any> | null = null, window: any = null, rayInstance: any = null) {
        window = window ?? getWindow();
        config = config ?? getAlpineRayConfig(window);
        rayInstance = rayInstance ?? ray;

        if (!(config.interceptErrors || false)) {
            return this;
        }

        window.addEventListener('error', (errorEvent: any) => {
            if (errorEvent.error) {
                const { el, expression } = errorEvent.error;
                const parentComponent = findParentComponent(el);

                // component and parent components are not alpine components, so do nothing
                if (!parentComponent) {
                    return;
                }

                // highlight the expression that triggered the error
                const parentComponentOuterHTML = highlightHtmlMarkup(parentComponent.outerHTML).replace(
                    encodeHtmlEntities(expression),
                    `<span class="text-red-700 bg-red-300 p-1">${encodeHtmlEntities(expression)}</span>`,
                );

                const componentData = parentComponent.__x ?? { $data: {} };

                rayInstance.table(
                    {
                        errorType: `alpine.js error`,
                        errorReason: errorEvent.error.toString(),
                        expression: `<code>${expression}</code>`,
                        srcElement: el.tagName.toLowerCase(),
                        componentHtml: `<code>${parentComponentOuterHTML}</code>`,
                        componentData: filterObjectKeys(componentData.$data, ['$el', '$watch', '$refs', '$nextTick']),
                    },
                    'ERROR',
                );
            }
        });

        window.addEventListener('unhandledrejection', (rejectionEvent: any) => {
            if (rejectionEvent.reason) {
                const { el, expression } = rejectionEvent.reason;
                const parentComponent = findParentComponent(el);

                // component and parent components are not alpine components, so do nothing
                if (!parentComponent) {
                    return;
                }

                // highlight the expression that triggered the error
                const parentComponentOuterHTML = highlightHtmlMarkup(parentComponent.outerHTML).replace(
                    encodeHtmlEntities(expression),
                    `<span class="text-red-700 bg-red-300 p-1">${encodeHtmlEntities(expression)}</span>`,
                );

                const componentData = parentComponent.__x ?? { $data: {} };

                rayInstance.table(
                    {
                        errorType: `alpine.js ${rejectionEvent.type}`,
                        errorReason: rejectionEvent.reason.toString(),
                        expression: `<code>${expression}</code>`,
                        srcElement: el.tagName.toLowerCase(),
                        componentHtml: `<code>${parentComponentOuterHTML}</code>`,
                        componentData: filterObjectKeys(componentData.$data, ['$el', '$watch', '$refs', '$nextTick']),
                    },
                    'ERROR',
                );
            }
        });

        return this;
    },

    init(config: AlpineRayConfig | Record<string, any> | null = null, window: any = null, rayInstance: any = null) {
        window = window ?? getWindow();
        config = config ?? getAlpineRayConfig(window);
        rayInstance = rayInstance ?? ray;

        this.initCustomEventListeners(config, window, rayInstance);
        this.initErrorHandlers(config, window, rayInstance);

        return this;
    },

    register(Alpine: any = null, window: any = null) {
        window = window ?? getWindow();
        Alpine = Alpine ?? window.Alpine;

        checkForAxios(window);

        Alpine.directive('ray', (_el, { expression }, { evaluate }) => {
            ray(evaluate(expression));
        });

        const rayCallback = (...params: any) => ray(...params);

        Alpine.magic('ray', () => rayCallback);
    },
};

export default AlpineRayMagicMethod;
