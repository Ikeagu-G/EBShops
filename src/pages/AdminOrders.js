import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const API_URL = "https://ebshops-backend.onrender.com/orders";
  const APPROVE_API_URL = "https://ebshops-backend.onrender.com/admin/approve_order";
  const DOWNLOAD_API_URL = "https://ebshops-backend.onrender.com/admin/download_invoice";

  // Fetch orders from backend with token
  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in');
      return;
    }

    try {
      const response = await axios.get(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to download an invoice with token
  const downloadInvoice = async (orderId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in');
      return;
    }

    try {
      const response = await axios.get(`${DOWNLOAD_API_URL}/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob' // For downloading PDF
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading invoice:", error.response?.data || error.message);
      alert("Failed to download invoice.");
    }
  };

  // Calculate total for an order
  const calculateOrderTotal = (order) => {
    if (!order.order_items || order.order_items.length === 0) return "0.00";
    return order.order_items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0).toFixed(2);
  };

  // Approve a single order by ID with token
  const approveOrder = async (orderId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in');
      return;
    }

    if (window.confirm("Approve this order and generate an invoice?")) {
      try {
        const response = await axios.post(`${APPROVE_API_URL}/${orderId}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Handle redirect response (302)
        const invoiceUrl = response.request.responseURL || `${DOWNLOAD_API_URL}/${orderId}`;
        alert(`Order approved! Invoice URL: ${invoiceUrl}`);
        fetchOrders();
      } catch (error) {
        console.error("Error approving order:", error.response?.data || error.message);
        alert("Failed to approve order.");
      }
    }
  };

  return (
    <div className="admin-orders-container">
      <h2>Admin Orders</h2>
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h3>Order #{order.id}</h3>
              <p><strong>Customer:</strong> {order.customer_name}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Location:</strong> {order.location}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </div>
            <div className="order-items">
              <h4>Items:</h4>
              {order.order_items && order.order_items.length > 0 ? (
                <ul>
                  {order.order_items.map((item, i) => (
                    <li key={i}>
                      {item.item_name} x {item.quantity} = ₦{(item.price * item.quantity).toFixed(2)}
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
              <button onClick={() => downloadInvoice(order.id)} className="download-invoice-btn">
                Download Invoice
              </button>
              <button onClick={() => approveOrder(order.id)} className="approve-order-btn">
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