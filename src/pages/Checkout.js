import React, { useState } from 'react';
import axios from 'axios';
import CartComponent  from '../components/CartComponent';

const Checkout = ({cart}) => {
  const [order, setOrder] = useState({ name: '', phone: '', location: '' });

  // In a real app, you would pass the cart items into this component.
  // For now, we'll assume a placeholder for items.
  //order.items = ["Sample Product"]; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!order.name || !order.phone || !order.location) {
      alert("Please fill out all fields");
      return;
    }
    //Build payload: use cart items instead of a placeholder
    const payload={...order,
        items: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity}),
    )};

    axios.post("https://ebshops-backend.onrender.com/orders", payload)
      .then(response => {
        alert("Order placed successfully!");
        setOrder({ name: '', phone: '', location: '' });
      })
      .catch(error => console.error("Error placing order:", error));
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <input type="text" name="name" placeholder="Name" value={order.name} onChange={handleChange} />
      <input type="text" name="phone" placeholder="Phone" value={order.phone} onChange={handleChange} />
      <input type="text" name="location" placeholder="Location" value={order.location} onChange={handleChange} />
      <button onClick={handleSubmit}>Place Order</button>
    </div>
  );
};

export default Checkout;
