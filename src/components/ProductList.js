import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css';

const API_URL = 'http://localhost:5000/api';

const ProductList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { categoryId, searchQuery } = location.state || {};
        const params = {};

        if (categoryId) {
          params.categoryId = categoryId;
        }
        if (searchQuery) {
          params.search = searchQuery;
        }

        const res = await axios.get(`${API_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` },
          params, 
        });

        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Ошибка загрузки товаров');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token, location.state]); 

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="product-list">
      <h2>Каталог товаров</h2>
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card" data-name={product.name.toLowerCase()}>
              <img src={product.image_urls?.[0] || '/placeholder.jpg'} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.price} руб.</p>
              <button onClick={() => navigate(`/product/${product.id}`)}>Подробнее</button>
            </div>
          ))
        ) : (
          <p>Товары не найдены.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;