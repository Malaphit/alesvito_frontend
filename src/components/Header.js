import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Header.css';

const API_URL = 'http://localhost:5000/api';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [token]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const res = await axios.get(`${API_URL}/products?search=${searchQuery}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate('/products', { state: { searchResults: res.data } });
      } catch (error) {
        console.error('Error searching products:', error);
      }
    } else {
      navigate('/products', { state: { searchResults: null } });
    }
  };

  const handleCatalogClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/products') {
      setIsCatalogOpen(!isCatalogOpen);
    } else {
      navigate('/products');
    }
  };

  const handleCategorySelect = (categoryId) => {
    navigate(`/category/${categoryId}`);
    setIsCatalogOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.header-left')) {
        setIsCatalogOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <button onClick={handleCatalogClick} className="header-button" id="catalogLink">
          Каталог
        </button>
        {isCatalogOpen && location.pathname === '/products' && (
          <div className="catalog-dropdown" id="catalogDropdown">
            {categories.map((category) => (
              <button
                key={category.id}
                data-category-id={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="category-item"
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
        <button onClick={() => navigate('/faq')} className="header-button">
          Частые вопросы
        </button>
      </div>
      <div className="header-center">
        <img
          src="/Photo/logoAV.jpg"
          alt="Handiwork Vito Rio Logo"
          onClick={() => navigate('/products')}
          className="logo"
        />
      </div>
      <div className="header-right">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск..."
            className="search-input"
            id="searchQuery"
          />
          <button type="submit" className="search-button">
            <span role="img" aria-label="search">🔍</span>
          </button>
        </form>
        <button onClick={() => navigate('/profile')} className="header-button">
          Профиль
        </button>
        <button onClick={() => navigate('/cart')} className="header-button">
          Корзина
        </button>
      </div>
    </header>
  );
};

export default Header;