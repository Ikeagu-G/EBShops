import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = ({ cart, removeFromCart, updateQuantity, clearCart }) => {
  const navigate = useNavigate();

  // Coerce prices: a string or null price would make the arithmetic produce NaN
  // and `.toFixed` throw.
  const total = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Shopping Cart</h2>
      {cart.length === 0 ? (
        <>
          <p>Your cart is empty</p>
          <Link to="/products" className="checkout-btn">Browse products</Link>
        </>
      ) : (
        <>
          {cart.map((item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 1;
            return (
              // Keyed by product id, not array index, so React reuses the right
              // row when an item is removed from the middle of the list.
              <div key={item.id} className="cart-item">
                <h4>{item.name}</h4>
                <div className="cart-item-quantity">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${item.name}`}
                    onClick={() => updateQuantity(item.id, quantity - 1)}
                  >
                    −
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${item.name}`}
                    onClick={() => updateQuantity(item.id, quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <p>₦{(price * quantity).toFixed(2)}</p>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                  Remove
                </button>
              </div>
            );
          })}
          <h3>Total: ₦{total.toFixed(2)}</h3>
          <div className="cart-actions">
            <button onClick={() => navigate('/checkout')} className="checkout-btn">
              Proceed to Checkout
            </button>
            <button onClick={clearCart} className="remove-btn">
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
