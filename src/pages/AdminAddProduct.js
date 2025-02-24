import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AdminAddProduct.css';

const AdminAddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    status: 'active',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setProduct(prev => ({ ...prev, image: files[0] }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('status', product.status);
    if (product.image) {
      formData.append('file', product.image);
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/admin/products', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Product added successfully!");
      setProduct({ name: '', price: '', status: 'active', image: null });
    } catch (err) {
      console.error("Error uploading product:", err);
      alert("Error adding product!");
    }
  };

  return (
    <div className="admin-add-product-container">
      <h2>Add New Product</h2>
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
            value={product.price} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select 
            name="status" 
            id="status" 
            value={product.status} 
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image">Product Image:</label>
          <input 
            type="file" 
            name="image" 
            id="image" 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
