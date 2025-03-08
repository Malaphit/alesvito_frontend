import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function AdminPanel() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    categoryId: '',
    name: '',
    description: '',
    price: '',
    imageUrls: '',
    sizeIds: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    Promise.all([
      axios.get(`${API_URL}/categories`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API_URL}/products`, { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data);
        setProducts(prodRes.data);
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/');
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = {
      categoryId: parseInt(form.categoryId),
      name: form.name,
      description: form.description,
      price: parseInt(form.price),
      imageUrls: form.imageUrls.split(',').map(url => url.trim()),
      sizeIds: form.sizeIds ? form.sizeIds.split(',').map(id => parseInt(id.trim())) : [],
    };

    try {
      await axios.post(`${API_URL}/products`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Товар создан!');
      const response = await axios.get(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <h1>Админ-панель</h1>
      <h2>Создать товар</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          placeholder="ID категории"
          required
        />
        <br />
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Название"
          required
        />
        <br />
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Описание"
        />
        <br />
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="Цена"
          required
        />
        <br />
        <input
          type="text"
          value={form.imageUrls}
          onChange={(e) => setForm({ ...form, imageUrls: e.target.value })}
          placeholder="URL изображений (через запятую)"
        />
        <br />
        <input
          type="text"
          value={form.sizeIds}
          onChange={(e) => setForm({ ...form, sizeIds: e.target.value })}
          placeholder="ID размеров (через запятую)"
        />
        <br />
        <button type="submit">Создать</button>
      </form>

      <h2>Категории</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>{cat.name} (вес: {cat.weight} г)</li>
        ))}
      </ul>

      <h2>Товары</h2>
      <ul>
        {products.map(prod => (
          <li key={prod.id}>{prod.name} - {prod.price} руб. ({prod.category_name})</li>
        ))}
      </ul>

      <button onClick={logout}>Выйти</button>
    </div>
  );
}

export default AdminPanel;