import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const API_URL = "http://127.0.0.1:5000/orders";
  const APPROVE_API_URL = "http://127.0.0.1:5000/admin/approve_order";
  const DOWNLOAD_API_URL = "http://127.0.0.1:5000/admin/download_invoice";

  // Fetch orders from backend
  const fetchOrders = () => {
    axios.get(API_URL)
      .then(response => setOrders(response.data))
      .catch(error => console.error("Error fetching orders:", error));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to download an invoice
  const downloadInvoice = (orderIndex) => {
    window.open(`${DOWNLOAD_API_URL}/${orderIndex}`, "_blank");
  };
  // Calculate total for an order
  const calculateOrderTotal = (order) => {
    if (!order.items || order.items.length === 0) return "0.00";
    return order.items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0).toFixed(2);
  };

  // Remove a single order by index
  const removeOrder = (index) => {
    if (window.confirm("Are you sure you want to remove this order?")) {
      axios.delete(`${API_URL}/${index}`)
        .then(response => {
          alert(response.data.message);
          fetchOrders();
        })
        .catch(error => {
          console.error("Error deleting order:", error);
          alert("Failed to delete order.");
        });
    }
  };

  // Clear all orders
  const clearOrders = () => {
    if (window.confirm("Are you sure you want to clear all orders?")) {
      axios.delete(API_URL)
        .then(response => {
          alert(response.data.message);
          setOrders([]);
        })
        .catch(error => {
          console.error("Error clearing orders:", error);
          alert("Failed to clear orders.");
        });
    }
  };

  // Approve a single order by index
  const approveOrder = (index) => {
    if (window.confirm("Approve this order and generate an invoice?")) {
      axios.post(`${APPROVE_API_URL}/${index}`)
        .then(response => {
          const { invoice_url } = response.data;
          alert(`Order approved! Invoice URL: ${invoice_url}`);
          fetchOrders();
        })
        .catch(error => {
          console.error("Error approving order:", error);
          alert("Failed to approve order.");
        });
    }
  };

  return (
    <div className="admin-orders-container">
      <h2>Admin Orders</h2>
      <div className="admin-orders-actions">
        <button onClick={clearOrders} className="clear-orders-btn">
          Clear All Orders
        </button>
      </div>
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="order-card">
            <div className="order-header">
              <h3>Order #{index + 1}</h3>
              <p><strong>Customer:</strong> {order.name}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Location:</strong> {order.location}</p>
            </div>
            <div className="order-items">
              <h4>Items:</h4>
              {order.items && order.items.length > 0 ? (
                <ul>
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.name} x {item.quantity} = ₦{(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No items recorded.</p>
              )}
            </div>
            <div className="order-total">
              <h4>Total: ₦{calculateOrderTotal(order)}</h4>
            </div>
            <div className="order-actions">
              <button onClick={() => downloadInvoice(index)} className="download-invoice-btn">
                Download Invoice
              </button>
              <button onClick={() => removeOrder(index)} className="remove-order-btn">
                Remove Order
              </button>
              <button onClick={() => approveOrder(index)} className="approve-order-btn">
                Approve Order
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
