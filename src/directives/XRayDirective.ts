import { filterObjectKeys, getWindow, highlightHtmlMarkup } from '../lib/utils';
import { ray } from '../AlpineRay';

export class XRayDirective {
    public static dumpAll(win: any = null, rayInstance: any = null) {
        win = win ?? getWindow();
        rayInstance = rayInstance ?? ray;

        try {
            win.document.body.querySelectorAll('[x-ray]').forEach(el => {
                const data =
                    typeof el['$data'] !== 'undefined' ? filterObjectKeys(el.$data, ['$el', '$watch', '$refs', '$nextTick']) : {};

                rayInstance().table(
                    {
                        component: '<div class="bg-blue-200 text-blue-700 p-1 rounded-md">component x-ray</div>',
                        data: data,
                        HTML: `<code class="text-sm text-black">${highlightHtmlMarkup(el.outerHTML)}</code>`,
                    },
                    'alpine.js'
                );
            });
        } catch (err) {
            //
        }
    }
}
