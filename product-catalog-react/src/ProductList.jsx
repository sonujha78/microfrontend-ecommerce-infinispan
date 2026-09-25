import React, { useEffect, useState } from 'react';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', price: 2499, stock: 34 },
  { id: 2, name: 'Mechanical Keyboard', price: 4999, stock: 12 },
  { id: 3, name: 'USB-C Hub', price: 1299, stock: 58 },
  { id: 4, name: '4K Monitor', price: 18999, stock: 7 },
];

export default function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Later this will call the backend API (which reads from Infinispan cache)
    const timer = setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <div>Loading products...</div>;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '16px' }}>
      <h2>Product Catalog</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {products.map((p) => (
          <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px' }}>
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
            <p style={{ fontSize: '12px', color: '#666' }}>Stock: {p.stock}</p>
            <button
              onClick={() => onAddToCart && onAddToCart(p)}
              style={{ padding: '6px 12px', cursor: 'pointer' }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
