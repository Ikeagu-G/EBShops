import React from 'react';
import ProductGrid from '../components/ProductGrid';

const Home = ({ products, addToCart, loading }) => {
  return (
    <div className="page-container">
      <h2 className="page-title">Featured Products</h2>
      <ProductGrid products={products} addToCart={addToCart} loading={loading} />
    </div>
  );
};

export default Home;
