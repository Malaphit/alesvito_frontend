import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Header.css'; // Создадим позже

const API_URL = 'http://localhost:5000/api';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const token = localStorage.getItem('token');

  // Получаем категории при загрузке
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

  // Логика поиска (работает только на главной)
  const handleSearch = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // Здесь будет фильтрация товаров (пока заглушка)
      console.log('Search for:', searchQuery);
      // В будущем: запрос к /api/products с параметром search
    }
  };

  // Логика каталога
  const handleCatalogClick = () => {
    if (location.pathname === '/') {
      setIsCatalogOpen(!isCatalogOpen);
    } else {
      navigate('/'); // Или /catalog, если создадим отдельную страницу
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <button onClick={handleCatalogClick} className="header-button">
          Каталог
        </button>
        {isCatalogOpen && location.pathname === '/' && (
          <div className="catalog-dropdown">
            {categories.map((category) => (
              <div key={category.id} onClick={() => navigate(`/category/${category.id}`)}>
                {category.name}
              </div>
            ))}
          </div>
        )}
        <button onClick={() => navigate('/faq')} className="header-button">
          Частые вопросы
        </button>
      </div>
      <div className="header-center">
        <img
          src="C:\Users\Malaphite\Desktop\webav\alesvito_frontend\Photo\logoAV.png" // Замени на реальный логотип
          alt="Handiwork Vito Rio Logo"
          onClick={() => navigate('/')}
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