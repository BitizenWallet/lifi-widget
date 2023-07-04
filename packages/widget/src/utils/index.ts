export * from './colors';
export * from './deepMerge';
export * from './elements';
export * from './enum';
export * from './format';
export * from './input';
export * from './navigationRoutes';
export * from './wallet';

export const openUrlInBitizen = (url: string) => (window as any).ethereum.request({
    method: 'bitizen_openURL',
    params: [url],
});