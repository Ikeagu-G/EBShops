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
  const API_URL = "https://ebshops-backend.onrender.com/admin/products";
  const LOGIN_URL = "https://ebshops-backend.onrender.com/admin/login";

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://ebshops-backend.onrender.com/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Check login status and fetch token if not present
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Prompt for login if no token (temporary for testing; ideally use a login page)
      loginAdmin();
    }
    fetchProducts();
  }, []);

  // Login function to get token
  const loginAdmin = async () => {
    try {
      const response = await axios.post(LOGIN_URL, {
        username: "Ebube",
        password: "07062206525"
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      console.log("Logged in, token stored:", token);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Please log in as admin to manage products.");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewProduct(prev => ({ ...prev, image: files[0] }));
    } else {
      setNewProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in first!");
      return;
    }
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("status", newProduct.status);
    if (newProduct.image) {
      formData.append("file", newProduct.image);
    }

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });
      alert("Product added successfully!");
      setNewProduct({ name: "", price: "", status: "active", image: null });
      fetchProducts();
    } catch (error) {
      console.error("Error uploading product:", error.response?.data || error.message);
    }
  };

  const handleUpdate = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in first!");
      return;
    }
    const newPrice = prompt("Enter new price:");
    const newStatus = prompt("Enter new status (active/out_of_stock):");
    try {
      const response = await axios.put(`${API_URL}/${productId}`, {
        price: parseFloat(newPrice),
        status: newStatus
      }, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      alert("Product updated successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in first!");
      return;
    }
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.delete(`${API_URL}/${productId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        alert("Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error.response?.data || error.message);
      }
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
            <img src={product.image_url} alt={product.name} className="product-image" />
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