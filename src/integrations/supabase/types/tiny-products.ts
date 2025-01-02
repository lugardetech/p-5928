export * from './tiny-product-base';
export * from './tiny-product-details';
export * from './tiny-product-relationships';

export type TinyProduct = import('./tiny-product-relationships').TinyProductWithRelationships;