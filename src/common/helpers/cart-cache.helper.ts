export const CART_CACHE_PREFIX = 'cart:user:';

export function getCartCacheKey(userId: string) {
  return `${CART_CACHE_PREFIX}${userId}`;
}
