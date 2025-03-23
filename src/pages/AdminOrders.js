import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Add this import
import '../styles/AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const API_URL = "https://ebshops-backend.onrender.com/orders";
  const ADMIN_ORDERS_API_URL = "https://ebshops-backend.onrender.com/admin/orders";
  const APPROVE_API_URL = "https://ebshops-backend.onrender.com/admin/approve_order";
  const DOWNLOAD_API_URL = "https://ebshops-backend.onrender.com/admin/download_invoice";

  const navigate = useNavigate(); // For redirection

  const fetchOrders = async () => {
    const token = localStorage.getItem('adminToken'); // Changed to 'adminToken'
    console.log('Retrieved token:', token);
    if (!token) {
      console.error('No token found in localStorage, redirecting to login');
      navigate('/admin/login'); // Redirect to login page
      return;
    }

    const headers = { 'Authorization': `Bearer ${token}` };
    console.log('Request headers:', headers);

    try {
      console.log('Making GET request to:', API_URL);
      const response = await axios.get(API_URL, { headers });
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Fetch error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      if (error.response?.status === 401) {
        console.error('Token invalid or expired, redirecting to login');
        localStorage.removeItem('adminToken'); // Clear invalid token
        navigate('/admin/login');
      }
    }
  };

  useEffect(() => {
    console.log('useEffect triggered');
    fetchOrders();
  }, [navigate]); // Add navigate to deps to ensure it’s available

  const downloadInvoice = async (orderId) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    try {
      const response = await axios.get(`${DOWNLOAD_API_URL}/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob'
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
      if (error.response?.status === 401) navigate('/admin/login');
    }
  };

  const calculateOrderTotal = (order) => {
    if (!order.order_items || order.order_items.length === 0) return "0.00";
    return order.order_items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0).toFixed(2);
  };

  const approveOrder = async (orderId) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    if (window.confirm("Approve this order and generate an invoice?")) {
      try {
        const response = await axios.post(`${APPROVE_API_URL}/${orderId}`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const invoiceUrl = response.request.responseURL || `${DOWNLOAD_API_URL}/${orderId}`;
        alert(`Order approved! Invoice URL: ${invoiceUrl}`);
        fetchOrders();
      } catch (error) {
        console.error("Error approving order:", error.response?.data || error.message);
        alert("Failed to approve order.");
        if (error.response?.status === 401) navigate('/admin/login');
      }
    }
  };

  const deleteOrder = async (orderId) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const response = await axios.delete(`${ADMIN_ORDERS_API_URL}/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert(response.data.message);
        fetchOrders();
      } catch (error) {
        console.error("Error deleting order:", error.response?.data || error.message);
        alert("Failed to delete order.");
        if (error.response?.status === 401) navigate('/admin/login');
      }
    }
  };

  const clearOrders = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    if (window.confirm("Are you sure you want to clear all orders?")) {
      try {
        const response = await axios.delete(ADMIN_ORDERS_API_URL, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert(response.data.message);
        setOrders([]);
      } catch (error) {
        console.error("Error clearing orders:", error.response?.data || error.message);
        alert("Failed to clear orders.");
        if (error.response?.status === 401) navigate('/admin/login');
      }
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
              <button onClick={() => deleteOrder(order.id)} className="remove-order-btn">
                Delete Order
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;