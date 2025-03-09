import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css';

const API_URL = 'http://localhost:5000/api';

const ProductList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [token]);

  useEffect(() => {
    let filtered = [...products];
    const searchQuery = location.state?.searchQuery || '';
    const categoryId = location.pathname.startsWith('/category/') 
      ? parseInt(location.pathname.split('/category/')[1]) 
      : null;

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryId) {
      filtered = filtered.filter((product) => product.category_id === categoryId);
    }

    setFilteredProducts(filtered);
  }, [location.state, location.pathname, products]);

  return (
    <div className="product-list">
      <h2>Каталог товаров</h2>
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card" data-name={product.name.toLowerCase()}>
            <img src={product.image_urls[0] || '/placeholder.jpg'} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price} руб.</p>
            <button onClick={() => navigate(`/product/${product.id}`)}>Подробнее</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;