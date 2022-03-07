import { getWindow } from '@/lib/utils';
import pluginCallback from '@/Plugin';

const win: any = getWindow();

win.document.addEventListener('alpine:init', () => {
    pluginCallback(win.Alpine, win);
});
