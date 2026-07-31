import React from 'react';
import Product from './Product';

const ProductGrid = ({ products, addToCart, loading = false }) => {
  if (loading) {
    return <p>Loading products…</p>;
  }

  // `products` arrives as a prop from a network call; guard against a non-array
  // payload rather than letting .map throw.
  if (!Array.isArray(products) || products.length === 0) {
    return <p>No products available right now. Please check back soon.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <Product key={product.id} product={product} addToCart={addToCart} />
      ))}
    </div>
  );
};

export default ProductGrid;
