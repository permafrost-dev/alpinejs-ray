import {ray} from '@/AlpineRay';
import {AlpineRayConfig, getAlpineRayConfig} from '@/AlpineRayConfig';
import {
    checkForAxios,
    encodeHtmlEntities,
    filterObjectKeys,
    findParentComponent,
    getWindow,
    highlightHtmlMarkup
} from '@/lib/utils';
import minimatch from 'minimatch';

function getMatches(patterns: string[], values: string[]) {
    const result: string[] = [];

    for (const pattern of patterns) {
        for (const value of values) {
            if (minimatch(value, pattern)) {
                result.push(value);
            }
        }
    }

    return result;
}

const AlpineRayMagicMethod = {
    trackRays: {},
    trackCounters: {},

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

            getMatches(config.logEvents, eventNames).forEach(name => {
                if (!config?.logEvents.includes(name) && !config?.logEvents.includes('*')) {
                    return;
                }

                const nameParts = name.split('.');
                const eventName: string = nameParts[0] ?? name;
                const lastNamePart = nameParts[nameParts.length - 1];

                window.addEventListener(eventName, e => {
                    if (eventName.includes('-') || (nameParts.length === 2 && lastNamePart === 'window')) {
                        rayInstance().table(
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

        const errorHandlerCallback = (errorEvent: any) => {
            if (errorEvent.error || errorEvent.reason) {
                const data = errorEvent.reason || errorEvent.error;

                const {el, expression} = data;
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

                const componentData = parentComponent.__x ?? {$data: {}};

                rayInstance().table(
                    {
                        errorType: `alpine.js error`,
                        errorReason: data.toString(),
                        expression: `<code>${expression}</code>`,
                        srcElement: el.tagName.toLowerCase(),
                        componentHtml: `<code>${parentComponentOuterHTML}</code>`,
                        componentData: filterObjectKeys(componentData.$data, ['$el', '$watch', '$refs', '$nextTick']),
                    },
                    'ERROR',
                );
            }
        };

        window.addEventListener('error', errorHandlerCallback);
        window.addEventListener('unhandledrejection', errorHandlerCallback);

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

    register(Alpine: any = null, window: any = null, rayInstance: any = null) {
        window = window ?? getWindow();
        Alpine = Alpine ?? window.Alpine;
        rayInstance = rayInstance ?? ray;

        checkForAxios(window);

        Alpine.directive('ray', (el, {expression}, {evaluateLater, effect}) => {
            const result = evaluateLater(expression);

            effect(() => {
                result(data => {
                    const tableData = {
                        'element-tag': el.tagName.toLowerCase(),
                        'element-id': null,
                        'element-ref': null,
                        'element-name': null,
                        'last-changed': new Date().toLocaleString(),
                        'change-counter': 0,
                        data,
                    };

                    let ident: any = null;

                    if (el.getAttribute('id')) {
                        tableData['element-id'] = el.getAttribute('id');
                        ident = el.getAttribute('id');
                    }

                    if (el.getAttribute('name')) {
                        tableData['element-name'] = el.getAttribute('name');
                        if (!ident) {
                            ident = el.getAttribute('name');
                        }
                    }

                    if (el.getAttribute('x-ref')) {
                        tableData['element-ref'] = el.getAttribute('x-ref');

                        if (!ident) {
                            ident = el.getAttribute('x-ref');
                        }
                    }

                    for (const name in tableData) {
                        if (name !== 'data' && tableData[name] === null) {
                            delete tableData[name];
                        }
                    }

                    if (ident) {
                        if (typeof this.trackRays[ident] === 'undefined') {
                            this.trackRays[ident] = rayInstance();
                            this.trackCounters[ident] = 0;
                        }

                        tableData['change-counter'] = ++this.trackCounters[ident];

                        tableData['data'] = `<div class="bg-red-400 p-1 rounded-md">${tableData['data']}</div>`;

                        this.trackRays[ident].table(tableData, 'alpine.js');

                        rayInstance = this.trackRays[ident];

                        this.trackRays[ident] = rayInstance().table(tableData, 'x-ray');

                        setTimeout(() => {
                            tableData['data'] = tableData['data'].replace('bg-red-400', '');
                            this.trackRays[ident] = rayInstance().table(tableData, 'x-ray');
                        }, 3000);
                    } else {
                        rayInstance().table(tableData, 'x-ray');
                    }
                });
            });
        });

        const rayCallback = (...params: any) => rayInstance(...params);

        Alpine.magic('ray', () => rayCallback);
    },
};

export default AlpineRayMagicMethod;
