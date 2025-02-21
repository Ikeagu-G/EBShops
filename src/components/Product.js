import React from 'react';

const Product = ({ product, addToCart }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <h3>{product.name}</h3>
      <p>₦{product.price.toFixed(2)}</p>
      <button onClick={() => addToCart(product)} className="add-to-cart-btn">
        Add to Cart
      </button>
    </div>
  );
};

export default Product;
