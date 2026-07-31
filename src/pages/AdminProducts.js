import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api';
import '../styles/AdminProducts.css';

const STATUSES = ['active', 'out_of_stock'];
const EMPTY_PRODUCT = { name: '', price: '', status: 'active', image: null };

const formatPrice = (value) => {
  // Supabase can serialise numerics as strings, and the column may be null.
  // Calling product.price.toFixed(2) directly threw and blanked the page.
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric.toFixed(2) : '0.00';
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  // Reset the file input after a successful upload: a File object cannot be
  // cleared by setting state alone.
  const [fileInputKey, setFileInputKey] = useState(0);

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

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Admin endpoint returns every product. Reading the public /products
      // endpoint (as before) hid out_of_stock items from the admin, so they
      // could never be switched back to active.
      const response = await api.get('/admin/products');
      setProducts(Array.isArray(response.data) ? response.data : []);
      setError('');
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(getErrorMessage(err, 'Could not load products.'));
      }
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  // No auto-login here. The previous version hardcoded the admin username and
  // password in client-side source, shipping them to every browser that loaded
  // the bundle. Auth is handled by the login page and session cookies.
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setNewProduct((prev) => ({ ...prev, image: files?.[0] || null }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const price = Number(newProduct.price);
    if (!newProduct.name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError('Enter a valid, non-negative price.');
      return;
    }
    if (!newProduct.image) {
      setError('Please choose a product image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', newProduct.name.trim());
    formData.append('price', String(price));
    formData.append('status', newProduct.status);
    formData.append('file', newProduct.image);

    setSubmitting(true);
    try {
      // Content-Type is intentionally not set: the browser must generate the
      // multipart boundary itself.
      await api.post('/admin/products', formData);
      setMessage('Product added successfully.');
      setNewProduct(EMPTY_PRODUCT);
      setFileInputKey((key) => key + 1);
      await fetchProducts();
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(getErrorMessage(err, 'Could not add the product.'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (product) => {
    setMessage('');
    setError('');

    const priceInput = window.prompt('Enter new price:', formatPrice(product.price));
    if (priceInput === null) return; // Cancelled
    const price = Number(priceInput);
    if (!Number.isFinite(price) || price < 0) {
      setError('Enter a valid, non-negative price.');
      return;
    }

    const statusInput = window.prompt(
      `Enter new status (${STATUSES.join(' / ')}):`,
      product.status || 'active'
    );
    if (statusInput === null) return;
    const status = statusInput.trim();
    if (!STATUSES.includes(status)) {
      setError(`Status must be one of: ${STATUSES.join(', ')}`);
      return;
    }

    try {
      await api.put(`/admin/products/${product.id}`, { price, status });
      setMessage('Product updated successfully.');
      await fetchProducts();
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(getErrorMessage(err, 'Could not update the product.'));
      }
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setMessage('');
    setError('');
    try {
      await api.delete(`/admin/products/${productId}`);
      setMessage('Product deleted successfully.');
      await fetchProducts();
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(getErrorMessage(err, 'Could not delete the product.'));
      }
    }
  };

  return (
    <div className="admin-products-container">
      <h2>Manage Products</h2>

      {message && <p className="success-message">{message}</p>}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleUpload} className="product-upload-form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          min="0"
          step="0.01"
          value={newProduct.price}
          onChange={handleChange}
          required
        />
        <select name="status" value={newProduct.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
        <input
          key={fileInputKey}
          type="file"
          name="image"
          accept="image/png,image/jpeg,image/gif,image/webp"
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding…' : 'Add Product'}
        </button>
      </form>

      <h3>Existing Products</h3>
      {loading ? (
        <p>Loading products…</p>
      ) : products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="product-image" />
              ) : (
                <div className="product-image product-image-placeholder">No image</div>
              )}
              <h4>{product.name}</h4>
              <p>Price: NGN {formatPrice(product.price)}</p>
              <p>Status: {product.status}</p>
              <div className="product-actions">
                <button onClick={() => handleUpdate(product)}>Update</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
