import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api';

const EMPTY_ORDER = { name: '', phone: '', location: '' };

const Checkout = ({ cart, clearCart }) => {
  const [order, setOrder] = useState(EMPTY_ORDER);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [placed, setPlaced] = useState(false);

  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!order.name.trim() || !order.phone.trim() || !order.location.trim()) {
      setError('Please fill out all fields.');
      return;
    }
    // Without this guard an empty cart posted items: [] and the backend 400'd
    // with nothing shown to the customer.
    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    const payload = {
      name: order.name.trim(),
      phone: order.phone.trim(),
      location: order.location.trim(),
      items: cart.map((item) => ({
        name: item.name,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
      })),
    };

    // Guards against a double-submit placing two identical orders.
    setSubmitting(true);
    setError('');
    try {
      await api.post('/orders', payload);
      setOrder(EMPTY_ORDER);
      // The cart was previously left intact after a successful order, so the
      // customer could submit the same basket again and again.
      clearCart();
      setPlaced(true);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not place your order. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (placed) {
    return (
      <div className="checkout-container">
        <h2>Thank you!</h2>
        <p>Your order has been placed. We will contact you shortly to confirm delivery.</p>
        <button onClick={() => navigate('/products')}>Continue shopping</button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-container">
        <h2>Checkout</h2>
        <p>Your cart is empty.</p>
        <Link to="/products" className="checkout-btn">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="checkout-summary">
        <h3>Order summary</h3>
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} x {item.quantity} = ₦
              {((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}
            </li>
          ))}
        </ul>
        <p><strong>Total: ₦{total.toFixed(2)}</strong></p>
      </div>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {/* A real form, so Enter submits and the browser can autofill. */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          autoComplete="name"
          value={order.name}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          autoComplete="tel"
          value={order.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Delivery location"
          autoComplete="street-address"
          value={order.location}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Placing order…' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
