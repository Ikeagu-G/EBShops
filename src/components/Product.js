import React, { useState } from 'react';

const Product = ({ product, addToCart }) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Supabase returns numerics as strings for some column types, and the column
  // can be null. Calling product.price.toFixed(2) directly threw a TypeError
  // and took down the whole product grid with a blank page.
  const price = Number(product.price);
  const displayPrice = Number.isFinite(price) ? price.toFixed(2) : '—';
  const outOfStock = product.status === 'out_of_stock';

  return (
    <div className="product-card">
      {product.image_url && !imageFailed ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="product-image product-image-placeholder">No image</div>
      )}
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">₦{displayPrice}</p>
      <button
        onClick={() => addToCart(product)}
        className="add-to-cart-btn"
        disabled={outOfStock}
      >
        {outOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default Product;
