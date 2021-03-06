/* eslint-disable no-undef */

export function getWindow() {
    // @ts-ignore
    return <any>globalThis;
}

/**
 * Determines if the node-ray standalone library has been installed and initialized in the current browser environment.
 *
 * @param window
 */
export const checkForAxios = (window: any = null) => {
    const win: any = window ?? getWindow();

    if (!win.axios) {
        throw new Error('[alpinejs-ray] axios is required for alpinejs-ray to function correctly.');
    }
};

/**
 * Determines if the node-ray standalone library has been installed and initialized in the current browser environment.
 *
 * @param window
 */
export const checkForRay = (window: any = null) => {
    const win: any = window ?? getWindow();

    if (!win.Ray || !win.Ray.Ray || !win.Ray.ray) {
        throw new Error('[alpinejs-ray] node-ray is required for alpinejs-ray to function correctly.');
    }
};

/**
 * Determines if alpine.js has been installed and initialized in the current browser environment.
 *
 * @param window
 */
export const checkForAlpine = (window: any = null) => {
    const win: any = window ?? getWindow();

    if (!win.Alpine) {
        throw new Error('[alpinejs-ray] Alpine is required for alpinejs-ray to function correctly.');
    }

    if (!win.Alpine.version || !isValidVersion('2.5.0', win.Alpine.version)) {
        throw new Error('Invalid Alpine version. Please use Alpine version 2.5.0 or above');
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
    let currentVersionIdentStr: string = '',
        requiredVersionIdentStr: string = '';

    let requiredArray: number[] = required.split('.').map(part => 1000 + parseInt(part));
    let currentArray: number[] = current.split('.').map(part => 1000 + parseInt(part));

    while (currentArray.length < requiredArray.length) {
        currentArray.push(1000);
    }

    // ensure the array lengths match
    currentArray = currentArray.slice(0, requiredArray.length - 1);

    for (let idx = 0; idx < currentArray.length; idx++) {
        currentVersionIdentStr += currentArray[idx].toString();
        requiredVersionIdentStr += requiredArray[idx].toString();
    }

    return Number(currentVersionIdentStr) >= Number(requiredVersionIdentStr);
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
