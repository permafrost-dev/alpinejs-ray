import { encodeHtmlEntities, filterObjectKeys, findParentComponent, getWindow, highlightHtmlMarkup } from './lib/utils';
import { ray } from './AlpineRay';

export function addErrorEventHandlers(window: any = null, rayInstance: any = null) {
    // @ts-ignore
    rayInstance = rayInstance ?? ray();
    window = window ?? getWindow();

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
                `<span class="text-red-700 bg-red-300 p-1">${encodeHtmlEntities(expression)}</span>`
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
                'ERROR'
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
                `<span class="text-red-700 bg-red-300 p-1">${encodeHtmlEntities(expression)}</span>`
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
                'ERROR'
            );
        }
    });
}
