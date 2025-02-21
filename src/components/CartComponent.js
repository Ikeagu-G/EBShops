import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cart, removeFromCart }) => {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <h4>{item.name}</h4>
              <p>{item.quantity || 1} × ₦{item.price.toFixed(2)}</p>
              <button onClick={() => removeFromCart(index)}>Remove</button>
            </div>
          ))}
          <h3>Total: ₦{total.toFixed(2)}</h3>
          <button onClick={() => navigate('/checkout')} className="checkout-btn">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
