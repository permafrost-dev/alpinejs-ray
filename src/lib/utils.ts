/**
 * Returns the global window object.
 */
export function getWindow(): Window {
    return window || globalThis;
}

/**
 * Determines if the axios library has been installed and initialized in the current browser environment.
 *
 */
export const checkForAxios = (window: Window | null = null) => {
    const win: Window = (window ?? getWindow()) as Window;

    if (!win.axios) {
        throw new Error('[alpinejs-ray] axios is required for alpinejs-ray to function correctly.');
    }
};

/**
 * Determines if the node-ray standalone library has been installed and initialized in the current browser environment.
 *
 */
export const checkForRay = (window: any = null) => {
    const win: Window = (window ?? getWindow()) as Window;

    if (!win.Ray || Object.keys(win.Ray).length === 0) {
        throw new Error('[alpinejs-ray] node-ray is required for alpinejs-ray to function correctly.');
    }
};

/**
 * Determines if alpine.js has been installed and initialized in the current browser environment.
 */
export const checkForAlpine = (window: any = null) => {
    const win: Window = (window ?? getWindow()) as Window;

    if (!win.Alpine) {
        throw new Error('[alpinejs-ray] Alpine is required for alpinejs-ray to function correctly.');
    }

    if (!win.Alpine.version || !isValidVersion('3.0.0', win.Alpine.version)) {
        throw new Error('Invalid Alpine version. Please use Alpine version 3.0.0 or above');
    }
};

/**
 * returns true if the `current` version string is greater than or equal to `required`
 * version string.
 *
 * this converts version strings like '2.5.1' to 100210051001, then compares values.
 *
 * @param required string
 * @param current string
 * @returns boolean
 */
export function isValidVersion(required: string, current: string) {
    const shiftedNum = n => (!n || n === '0' ? 100 : Number.parseInt(n.padEnd(3, '0')) || 100);

    const requiredArr = required.split('.').map(part => shiftedNum(part));
    const currentArr = current.split('.').map(part => shiftedNum(part));

    while (currentArr.length < requiredArr.length && currentArr.length < 5) {
        currentArr.push(100);
    }

    const currentLong = Number(currentArr.join(''));
    const requiredLong = Number(requiredArr.join(''));

    return currentLong >= requiredLong;
}

export const encodeHtmlEntities = (str: string) => {
    const escapeChars: Record<string, string> = {
        '¢': 'cent',
        '£': 'pound',
        '¥': 'yen',
        '€': 'euro',
        '©': 'copy',
        '®': 'reg',
        '<': 'lt',
        '>': 'gt',
        '"': 'quot',
        '&': 'amp',
        "'": '#39',
        ' ': 'nbsp',
    };

    const chars: string[] = Object.keys(escapeChars);
    const regex = new RegExp(`[${chars.join('')}]`, 'g');

    return str.replace(regex, m => `&${escapeChars[m]};`);
};

export const filterObjectKeys = (obj: Record<string, unknown>, ignoreKeys: string[]): Record<string, unknown> => {
    const result = {};

    Object.keys(obj)
        .filter(key => !ignoreKeys.includes(key))
        .forEach(key => {
            result[key] = obj[key];
        });

    return result;
};

export const highlightHtmlMarkup = (str: string) => {
    return (
        encodeHtmlEntities(str)
            .replace(/(:?href|:?id|:?name|:?value|:?type|:?style|:?class|:?key)=/g, '<span class="text-orange-400">$1</span>=')
            .replace(/&#39;/g, "'")
            .replace(/('[^']*')/g, '<div class="text-purple-600 inline">$1</div>')
            //.replace(/'/g, '&#39;')
            .replace(/=&quot;(.+)(true|false)(.*)&quot;/g, '=&quot;$1<span class="text-orange-600 font-bold">$2</span>$3&quot;')
            .replace(/&quot;(.*)&quot;/g, '<span class="text-green-600">&quot;$1&quot;</span>')
            .replace(/([{,](?:&nbsp;|\s*))('\w+'|\w+):/g, '$1<div class="text-blue-800 bg-blue-200 rounded-md p-1 inline">$2</div>:')
            .replace(/:&nbsp;(-?\d+\.\d+|-?\d+)/g, ':&nbsp;<span class="text-red-800">$1</span>')
            .replace(/:&nbsp;(true|false|null)/g, ':&nbsp;<span class="text-orange-600 font-bold">$1</span>')

            .replace(/\r?\n/g, '<br>')
            .replace(/(&lt;)(\/?\s*[\w-_]+)(&gt;)?/g, '<span class="text-blue-600">$1$2$3</span>')
            .replace(
                /(@click|x-bind|x-cloak|x-data|x-for|x-if|x-html|x-init|x-model[\.\-\w+]*|x-on:\w+[\.\-\w+]*|x-ref|x-show|x-spread|x-transition:\w+[\-\w]+|x-text)=/g,
                '<span class="text-indigo-800">$1</span>=',
            )
            .replace(/(\$el|\$refs|\$event|\$data|\$dispatch|\$nextTick|\$watch|\$ray)/g, '<span class="text-red-700">$1</span>')
    );
};

export function getComponentName(element: HTMLElement) {
    return (
        element.getAttribute('x-title') ||
        element.getAttribute('x-id') ||
        element.id ||
        element.getAttribute('name') ||
        element.getAttribute('title') ||
        findWireID(element.getAttribute('wire:id')) ||
        findLiveViewName(element) ||
        element.getAttribute('aria-label') ||
        extractFunctionName(element.getAttribute('x-data')) ||
        element.getAttribute('role') ||
        element.tagName.toLowerCase()
    );
}

export function findWireID(wireId, window: any = null) {
    window = window ?? getWindow();

    if (wireId && window.livewire) {
        try {
            const wire = window.livewire.find(wireId);

            if (wire.__instance) {
                return 'livewire:' + wire.__instance.fingerprint.name;
            }
        } catch (e) {
            //
        }
    }
}

export function findLiveViewName(alpineEl, window: any = null) {
    window = window ?? getWindow();

    const phxEl = alpineEl.closest('[data-phx-view]');
    if (phxEl) {
        // pretty sure we could do the following instead
        // return phxEl.dataset.phxView;
        if (!window.liveSocket.getViewByEl) {
            return;
        }
        const view = window.liveSocket.getViewByEl(phxEl);
        return view && view.name;
    }
}

export function extractFunctionName(functionName) {
    if (!functionName) {
        return '';
    }

    if (functionName?.startsWith('{')) {
        return '';
    }

    return functionName
        .replace(/\(([^\)]+)\)/, '') // Handles myFunction(param)
        .replace('()', '');
}

export function findParentComponent(el: any) {
    let counter = 0;
    let e = el;

    while (counter < 30) {
        counter++;
        e = e.parentElement;

        if (e?.hasAttribute('x-data')) {
            return e;
        }

        if (!e) {
            return null;
        }
    }

    return null;
}
