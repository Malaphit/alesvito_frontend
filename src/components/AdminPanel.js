import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminChat from './AdminChat'; // Импортируем новый компонент
import './AdminPanel.css';

const API_URL = 'http://localhost:5000/api';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ id: '', name: '', description: '', weight: '' });
  const [sizeForm, setSizeForm] = useState({ id: '', size: '' });
  const [productForm, setProductForm] = useState({
    id: '',
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

    const fetchData = async () => {
      try {
        const [catRes, prodRes, sizeRes, orderRes] = await Promise.all([
          axios.get(`${API_URL}/categories`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/products`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/sizes`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
        setSizes(sizeRes.data);
        setOrders(orderRes.data);
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    fetchData();
  }, [navigate]);

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = {
      name: categoryForm.name,
      description: categoryForm.description,
      weight: parseInt(categoryForm.weight),
    };

    try {
      if (categoryForm.id) {
        await axios.put(`${API_URL}/categories/${categoryForm.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}/categories`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setCategoryForm({ id: '', name: '', description: '', weight: '' });
      const [catRes] = await Promise.all([
        axios.get(`${API_URL}/categories`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setCategories(catRes.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка');
    }
  };

  const handleCategoryEdit = (category) => {
    setCategoryForm({
      id: category.id,
      name: category.name,
      description: category.description,
      weight: category.weight,
    });
  };

  const handleCategoryDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const [catRes] = await Promise.all([
        axios.get(`${API_URL}/categories`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setCategories(catRes.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка');
    }
  };

  const handleSizeSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = { size: sizeForm.size };

    try {
      if (sizeForm.id) {
        await axios.put(`${API_URL}/sizes/${sizeForm.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}/sizes`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setSizeForm({ id: '', size: '' });
      const [sizeRes] = await Promise.all([
        axios.get(`${API_URL}/sizes`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setSizes(sizeRes.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка');
    }
  };

  const handleSizeEdit = (size) => {
    setSizeForm({ id: size.id, size: size.size });
  };

  const handleSizeDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/sizes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const [sizeRes] = await Promise.all([
        axios.get(`${API_URL}/sizes`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setSizes(sizeRes.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const imageUrls = productForm.imageUrls
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    const sizeIds = productForm.sizeIds
      .split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id) && id);
    const data = {
      categoryId: parseInt(productForm.categoryId) || null,
      name: productForm.name || '',
      description: productForm.description || '',
      price: parseInt(productForm.price) || 0,
      imageUrls,
      sizeIds,
    };

    try {
      if (productForm.id) {
        await axios.put(`${API_URL}/products/${productForm.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}/products`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setProductForm({
        id: '',
        categoryId: '',
        name: '',
        description: '',
        price: '',
        imageUrls: '',
        sizeIds: '',
      });
      const [prodRes] = await Promise.all([
        axios.get(`${API_URL}/products`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setProducts(prodRes.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка');
    }
  };

  const handleProductEdit = (product) => {
    setProductForm({
      id: product.id,
      categoryId: product.category_id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrls: product.image_urls.join(','),
      sizeIds: product.sizes.map(s => s.id).join(','),
    });
  };

  const handleProductDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const [prodRes] = await Promise.all([
        axios.get(`${API_URL}/products`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setProducts(prodRes.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка');
    }
  };

  const handleOrderStatusUpdate = async (orderId, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_URL}/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const [orderRes] = await Promise.all([
        axios.get(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setOrders(orderRes.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка');
    }
  };

  const handleExportViews = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_URL}/products/export/views`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'product_views.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="admin-panel">
      <h1>Админ-панель</h1>
      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Категории
        </button>
        <button
          className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Товары
        </button>
        <button
          className={`tab-button ${activeTab === 'sizes' ? 'active' : ''}`}
          onClick={() => setActiveTab('sizes')}
        >
          Размеры
        </button>
        <button
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Заказы
        </button>
        <button
          className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Чат
        </button>
        <button
          className={`tab-button ${activeTab === 'export' ? 'active' : ''}`}
          onClick={() => setActiveTab('export')}
        >
          Экспорт
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'categories' && (
          <div className="tab-section">
            <h2>Управление категориями</h2>
            <form onSubmit={handleCategorySubmit}>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="Название категории"
                required
              />
              <input
                type="text"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Описание"
              />
              <input
                type="number"
                value={categoryForm.weight}
                onChange={(e) => setCategoryForm({ ...categoryForm, weight: e.target.value })}
                placeholder="Вес (г)"
                required
              />
              <button type="submit">{categoryForm.id ? 'Обновить' : 'Создать'}</button>
            </form>
            <h3>Список категорий</h3>
            <ul>
              {categories.map((cat) => (
                <li key={cat.id}>
                  {cat.name} (вес: {cat.weight} г)
                  <button onClick={() => handleCategoryEdit(cat)}>Редактировать</button>
                  <button onClick={() => handleCategoryDelete(cat.id)}>Удалить</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="tab-section">
            <h2>Управление товарами</h2>
            <form onSubmit={handleProductSubmit}>
              <input
                type="number"
                value={productForm.categoryId}
                onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                placeholder="ID категории"
                required
              />
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="Название"
                required
              />
              <input
                type="text"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                placeholder="Описание"
              />
              <input
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                placeholder="Цена"
                required
              />
              <input
                type="text"
                value={productForm.imageUrls}
                onChange={(e) => setProductForm({ ...productForm, imageUrls: e.target.value })}
                placeholder="URL изображений (через запятую)"
              />
              <input
                type="text"
                value={productForm.sizeIds}
                onChange={(e) => setProductForm({ ...productForm, sizeIds: e.target.value })}
                placeholder="ID размеров (через запятую)"
              />
              <button type="submit">{productForm.id ? 'Обновить' : 'Создать'}</button>
            </form>
            <h3>Список товаров</h3>
            <ul>
              {products.map((prod) => (
                <li key={prod.id}>
                  {prod.name} - {prod.price} руб. ({prod.category_name}) | Размеры:{' '}
                  {prod.sizes && Array.isArray(prod.sizes)
                    ? prod.sizes.map((s) => s.size).join(', ')
                    : 'Нет размеров'}{' '}
                  | Просмотров: {prod.views_count || 0}
                  <button onClick={() => handleProductEdit(prod)}>Редактировать</button>
                  <button onClick={() => handleProductDelete(prod.id)}>Удалить</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'sizes' && (
          <div className="tab-section">
            <h2>Управление размерами</h2>
            <form onSubmit={handleSizeSubmit}>
              <input
                type="text"
                value={sizeForm.size}
                onChange={(e) => setSizeForm({ ...sizeForm, size: e.target.value })}
                placeholder="Размер (например, 38)"
                required
              />
              <button type="submit">{sizeForm.id ? 'Обновить' : 'Создать'}</button>
            </form>
            <h3>Список размеров</h3>
            <ul>
              {sizes.map((size) => (
                <li key={size.id}>
                  {size.size}
                  <button onClick={() => handleSizeEdit(size)}>Редактировать</button>
                  <button onClick={() => handleSizeDelete(size.id)}>Удалить</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="tab-section">
            <h2>Управление заказами</h2>
            <ul>
              {orders.map((order) => (
                <li key={order.id}>
                  Заказ #{order.id} | Пользователь: {order.user_email} | Сумма: {order.total_price}{' '}
                  руб. | Статус: {order.status}
                  <select
                    value={order.status}
                    onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                  >
                    <option value="pending">Ожидает</option>
                    <option value="shipped">Отправлен</option>
                    <option value="delivered">Доставлен</option>
                    <option value="canceled">Отменен</option>
                  </select>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'chat' && <AdminChat />}

        {activeTab === 'export' && (
          <div className="tab-section">
            <h2>Экспорт данных</h2>
            <button onClick={handleExportViews}>Экспорт статистики просмотров</button>
          </div>
        )}

        <button onClick={logout} className="logout-button">
          Выйти
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;