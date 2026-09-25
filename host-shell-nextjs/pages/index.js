import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { init, loadRemote } from '@module-federation/runtime';

let initialized = false;

function ensureInit() {
  if (initialized) return;
  initialized = true;
  init({
    name: 'hostShell',
    remotes: [
      { name: 'productCatalog', entry: 'http://localhost:3001/remoteEntry.js' },
      { name: 'shoppingCart', entry: 'http://localhost:3002/remoteEntry.js' },
      { name: 'marketingLanding', entry: 'http://localhost:3004/remoteEntry.js' },
    ],
    shared: {
      react: {
        version: '18.2.0',
        scope: 'default',
        lib: () => React,
        shareConfig: { singleton: true, requiredVersion: '^18.2.0' },
      },
      'react-dom': {
        version: '18.2.0',
        scope: 'default',
        lib: () => ReactDOM,
        shareConfig: { singleton: true, requiredVersion: '^18.2.0' },
      },
    },
  });
}

export default function Home() {
  const [ProductList, setProductList] = useState(null);
  const cartRef = useRef(null);
  const landingRef = useRef(null);

  useEffect(() => {
    ensureInit();

    loadRemote('productCatalog/ProductList').then((mod) => {
      setProductList(() => mod.default);
    });

    loadRemote('shoppingCart/CartWidget').then(async (mod) => {
      const { createApp } = await import('vue');
      if (cartRef.current) {
        createApp(mod.default).mount(cartRef.current);
      }
    });

    loadRemote('marketingLanding/mount').then((mod) => {
      if (landingRef.current) {
        mod.mount(landingRef.current);
      }
    });
  }, []);

  function handleAddToCart(product) {
    window.dispatchEvent(new CustomEvent('mf:cart:add', { detail: product }));
  }

  return (
    <div>
      <div ref={landingRef}></div>

      <div style={{ display: 'flex', gap: '24px', padding: '24px' }}>
        <div style={{ flex: 2 }}>
          {ProductList ? <ProductList onAddToCart={handleAddToCart} /> : <p>Loading Product Catalog...</p>}
        </div>
        <div style={{ flex: 1 }} ref={cartRef}></div>
      </div>

      <div style={{ padding: '24px', borderTop: '2px solid #eee' }}>
        <h3 style={{ marginBottom: '12px' }}>Checkout & Admin</h3>
        <iframe
          src="http://localhost:3003"
          title="Checkout and Admin"
          style={{ width: '100%', height: '400px', border: '1px solid #ddd', borderRadius: '8px' }}
        />
      </div>
    </div>
  );
}
