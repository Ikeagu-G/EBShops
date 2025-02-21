import React from 'react';
import ProductGrid from '../components/ProductGrid';

const Home = ({ products, addToCart }) => {
  return (
    <div className="page-container">
      <h2 className="page-title">Featured Products</h2>
      <ProductGrid products={products} addToCart={addToCart} />
    </div>
  );
};

export default Home;
