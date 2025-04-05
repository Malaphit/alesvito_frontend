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
  const [isAdmin, setIsAdmin] = useState(false);

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
      const checkAdminRole = async () => {
        if (token) {
          try {
            const response = await axios.get(`${API_URL}/users/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const roles = response.data.role ? [response.data.role] : []; 
            setIsAdmin(roles.includes('admin'));
            localStorage.setItem('userData', JSON.stringify(response.data)); 
          } catch (error) {
            console.error('Error checking role:', error);
          }
        }
      };
      if (token) {
        fetchCategories();
        checkAdminRole();
      }
    }, [token]);


  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/products', { state: { searchQuery } });
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
    navigate('/products', { state: { categoryId } });
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
          src="src/Photo/logoAV.jpg"
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
        {token && (
          <>
            <button onClick={() => navigate('/profile')} className="header-button">
              Профиль
            </button>
            <button onClick={() => navigate('/cart')} className="header-button">
              Корзина
            </button>
            {isAdmin && (
              <button onClick={() => navigate('/admin')} className="header-button">
                Админ
              </button>
            )}
          </>
        )}
        {!token && (
          <button onClick={() => navigate('/')} className="header-button">
            Войти
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;