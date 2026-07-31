import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api';
import '../styles/AdminAddProduct.css';

const EMPTY_PRODUCT = { name: '', price: '', status: 'active', image: null };

const AdminAddProduct = () => {
  const [product, setProduct] = useState(EMPTY_PRODUCT);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // Bumping the key remounts the file input so the chosen filename clears.
  const [fileInputKey, setFileInputKey] = useState(0);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setProduct((prev) => ({ ...prev, image: files?.[0] || null }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const price = Number(product.price);
    if (!product.name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError('Enter a valid, non-negative price.');
      return;
    }
    if (!product.image) {
      setError('Please choose a product image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', product.name.trim());
    formData.append('price', String(price));
    formData.append('status', product.status);
    formData.append('file', product.image);

    setSubmitting(true);
    try {
      // Uses the shared client, so the session cookie is attached. The old
      // version sent no credentials at all and always got a 401. It also set
      // Content-Type manually, which strips the multipart boundary.
      await api.post('/admin/products', formData);
      setMessage('Product added successfully.');
      setProduct(EMPTY_PRODUCT);
      setFileInputKey((key) => key + 1);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setError(getErrorMessage(err, 'Error adding product.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-add-product-container">
      <h2>Add New Product</h2>

      {message && <p className="success-message">{message}</p>}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="admin-add-product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            name="price"
            id="price"
            min="0"
            step="0.01"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select name="status" id="status" value={product.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image">Product Image:</label>
          <input
            key={fileInputKey}
            type="file"
            name="image"
            id="image"
            accept="image/png,image/jpeg,image/gif,image/webp"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding…' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
