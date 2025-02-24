import React from 'react';
import ProductGrid from '../components/ProductGrid';
import '../styles/CustomerProducts.css';

const CustomerProducts = ({ products, addToCart }) => {
  return (
    <div className="page-container">
      <h2 className="page-title">Our Products</h2>
      <ProductGrid products={products} addToCart={addToCart} />
    </div>
  );
};

export default CustomerProducts;
