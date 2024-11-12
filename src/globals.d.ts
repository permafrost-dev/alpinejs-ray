import axios from 'axios';
import Alpine from 'alpinejs';
import { Ray } from 'node-ray/dist/web';

declare global {
    interface Window {
        Alpine?: typeof Alpine;
        Ray: Ray;
        axios?: typeof axios;
    }
}
