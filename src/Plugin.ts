import AlpineRayMagicMethod from '@/AlpineRayMagicMethod';

export default function (Alpine: any, window: any = null) {
    AlpineRayMagicMethod.init(null, window).register(Alpine, window);
}
