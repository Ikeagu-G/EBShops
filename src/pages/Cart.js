import React from "react";

const Cart = ({ cart }) => {
  return (
    <section id="order">
      <h2>Your Order</h2>
      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price} x {item.quantity} {item.unit}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Cart;