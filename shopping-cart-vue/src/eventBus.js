// Simple shared event bus using a global CustomEvent on window.
// This is the "shared state contract" between Product Catalog and Cart —
// no direct imports between micro-frontends, just events.
export const CART_ADD_EVENT = 'mf:cart:add';

export function emitAddToCart(product) {
  window.dispatchEvent(new CustomEvent(CART_ADD_EVENT, { detail: product }));
}

export function onAddToCart(callback) {
  window.addEventListener(CART_ADD_EVENT, (e) => callback(e.detail));
}
