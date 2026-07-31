import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api';
import '../styles/AdminOrders.css';

const lineTotal = (item) => (Number(item.price) || 0) * (Number(item.quantity) || 0);

const formatAmount = (value) => (Number(value) || 0).toFixed(2);

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  // Track the order currently being acted on so its buttons can be disabled.
  const [busyOrderId, setBusyOrderId] = useState(null);

  const navigate = useNavigate();

  const handleAuthError = useCallback(
    (err) => {
      if (err.response?.status === 401) {
        navigate('/admin/login', { replace: true });
        return true;
      }
      return false;
    },
    [navigate]
  );

  // Auth is cookie-based, so there is no localStorage token to read or attach.
  // The old code sent `Authorization: Bearer <token from localStorage>`, which
  // was never populated, so every request was unauthenticated.
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      setOrders(Array.isArray(response.data) ? response.data : []);
      setError('');
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(getErrorMessage(err, 'Could not load orders.'));
      }
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const calculateOrderTotal = (order) => {
    if (!order.order_items?.length) return '0.00';
    return order.order_items.reduce((sum, item) => sum + lineTotal(item), 0).toFixed(2);
  };

  const downloadInvoice = async (orderId) => {
    setMessage('');
    setError('');
    setBusyOrderId(orderId);
    let objectUrl;
    try {
      const response = await api.get(`/admin/download_invoice/${orderId}`, {
        responseType: 'blob',
      });
      objectUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      );
      const link = document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(getErrorMessage(err, 'Failed to download invoice.'));
      }
    } finally {
      // Release the blob URL; the original never revoked it, leaking memory on
      // every download.
      if (objectUrl) window.URL.revokeObjectURL(objectUrl);
      setBusyOrderId(null);
    }
  };

  const approveOrder = async (orderId) => {
    if (!window.confirm('Approve this order and generate an invoice?')) return;
    setMessage('');
    setError('');
    setBusyOrderId(orderId);
    try {
      // The endpoint now returns JSON. Previously it answered with a bare 302
      // and the client read response.request.responseURL, which was unreliable.
      await api.post(`/admin/approve_order/${orderId}`);
      setMessage('Order approved. The invoice is ready to download.');
      await fetchOrders();
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(getErrorMessage(err, 'Failed to approve order.'));
      }
    } finally {
      setBusyOrderId(null);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    setMessage('');
    setError('');
    setBusyOrderId(orderId);
    try {
      const response = await api.delete(`/admin/orders/${orderId}`);
      setMessage(response.data?.message || 'Order deleted.');
      await fetchOrders();
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(getErrorMessage(err, 'Failed to delete order.'));
      }
    } finally {
      setBusyOrderId(null);
    }
  };

  const clearOrders = async () => {
    if (!window.confirm('Are you sure you want to clear ALL orders? This cannot be undone.')) {
      return;
    }
    setMessage('');
    setError('');
    try {
      const response = await api.delete('/admin/orders');
      setMessage(response.data?.message || 'All orders cleared.');
      setOrders([]);
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(getErrorMessage(err, 'Failed to clear orders.'));
      }
    }
  };

  return (
    <div className="admin-orders-container">
      <h2>Admin Orders</h2>

      {message && <p className="success-message">{message}</p>}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <div className="admin-orders-actions">
        <button onClick={clearOrders} className="clear-orders-btn" disabled={!orders.length}>
          Clear All Orders
        </button>
      </div>

      {loading ? (
        <p>Loading orders…</p>
      ) : orders.length === 0 ? (
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
              {order.order_items?.length ? (
                <ul>
                  {order.order_items.map((item) => (
                    <li key={item.id || `${item.item_name}-${item.quantity}`}>
                      {item.item_name} x {item.quantity} = ₦{formatAmount(lineTotal(item))}
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
              <button
                onClick={() => downloadInvoice(order.id)}
                className="download-invoice-btn"
                disabled={busyOrderId === order.id}
              >
                Download Invoice
              </button>
              <button
                onClick={() => approveOrder(order.id)}
                className="approve-order-btn"
                disabled={busyOrderId === order.id || order.status === 'approved'}
              >
                {order.status === 'approved' ? 'Approved' : 'Approve Order'}
              </button>
              <button
                onClick={() => deleteOrder(order.id)}
                className="remove-order-btn"
                disabled={busyOrderId === order.id}
              >
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
