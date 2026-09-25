import React from 'react';
import ReactDOM from 'react-dom/client';
import ProductList from './ProductList';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ProductList onAddToCart={(p) => console.log('Added:', p)} />);
