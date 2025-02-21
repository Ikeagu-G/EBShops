import React from 'react';
import Product from './Product';

const ProductGrid = ({ products, addToCart }) => {
  return (
    <div className="product-grid">
      {products.map(product => (
        <Product key={product.id} product={product} addToCart={addToCart} />
      ))}
    </div>
  );
};

export default ProductGrid;
