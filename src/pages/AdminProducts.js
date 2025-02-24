import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    status: "active",
    image: null
  });
  const API_URL = "http://127.0.0.1:5000/admin/products";

  // Fetch products from backend (for admin, you might show all products)
  const fetchProducts = () => {
    axios.get("http://127.0.0.1:5000/products")
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error fetching products:", error));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewProduct(prev => ({ ...prev, image: files[0] }));
    } else {
      setNewProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("status", newProduct.status);
    if (newProduct.image) {
      formData.append("file", newProduct.image);
    }

    axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
      .then(response => {
        alert("Product added successfully!");
        setNewProduct({ name: "", price: "", status: "active", image: null });
        fetchProducts();
      })
      .catch(error => console.error("Error uploading product:", error));
  };

  const handleUpdate = (productId) => {
    const newPrice = prompt("Enter new price:");
    const newStatus = prompt("Enter new status (active/out_of_stock):");
    axios.put(`${API_URL}/${productId}`, { price: parseFloat(newPrice), status: newStatus })
      .then(response => {
        alert("Product updated successfully!");
        fetchProducts();
      })
      .catch(error => console.error("Error updating product:", error));
  };

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios.delete(`${API_URL}/${productId}`)
        .then(response => {
          alert("Product deleted successfully!");
          fetchProducts();
        })
        .catch(error => console.error("Error deleting product:", error));
    }
  };

  return (
    <div className="admin-products-container">
      <h2>Manage Products</h2>
      <form onSubmit={handleUpload} className="product-upload-form">
        <input type="text" name="name" placeholder="Product Name" value={newProduct.name} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleChange} required />
        <select name="status" value={newProduct.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
        <input type="file" name="image" onChange={handleChange} required />
        <button type="submit">Add Product</button>
      </form>
      <h3>Existing Products</h3>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h4>{product.name}</h4>
            <p>Price: NGN {product.price.toFixed(2)}</p>
            <p>Status: {product.status}</p>
            <div className="product-actions">
              <button onClick={() => handleUpdate(product.id)}>Update</button>
              <button onClick={() => handleDelete(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
