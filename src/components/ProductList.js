import React, { useState, useEffect, useCallback } from 'react';
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

  const applyFilters = useCallback((productsToFilter) => {
    let filtered = [...productsToFilter];
    if (location.state?.searchResults) {
      filtered = location.state.searchResults;
    } else if (location.pathname.startsWith('/category/')) {
      const categoryId = location.pathname.split('/category/')[1];
      filtered = filtered.filter((p) => p.category_id === parseInt(categoryId));
    }
    setFilteredProducts(filtered);
  }, [location.state, location.pathname]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
        applyFilters(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [token, applyFilters]);

  useEffect(() => {
    applyFilters(products);
  }, [location.state, location.pathname, products, applyFilters]);

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