import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function OrderForm() {
  const [form, setForm] = useState({
    productId: '',
    sizeId: '',
    quantity: '',
    deliveryAddress: '',
    bonusPointsUsed: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const items = [{
      productId: parseInt(form.productId),
      sizeId: parseInt(form.sizeId),
      quantity: parseInt(form.quantity),
    }];
    const data = {
      items,
      deliveryAddress: form.deliveryAddress,
      bonusPointsUsed: parseInt(form.bonusPointsUsed) || 0,
    };

    try {
      await axios.post(`${API_URL}/orders`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Заказ создан!');
      navigate('/profile');
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка');
    }
  };

  return (
    <div>
      <h1>Создать заказ</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={form.productId}
          onChange={(e) => setForm({ ...form, productId: e.target.value })}
          placeholder="ID товара"
          required
        />
        <br />
        <input
          type="number"
          value={form.sizeId}
          onChange={(e) => setForm({ ...form, sizeId: e.target.value })}
          placeholder="ID размера"
          required
        />
        <br />
        <input
          type="number"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          placeholder="Количество"
          required
        />
        <br />
        <input
          type="text"
          value={form.deliveryAddress}
          onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
          placeholder="Адрес доставки"
          required
        />
        <br />
        <input
          type="number"
          value={form.bonusPointsUsed}
          onChange={(e) => setForm({ ...form, bonusPointsUsed: e.target.value })}
          placeholder="Использовать бонусы (0 если нет)"
        />
        <br />
        <button type="submit">Оформить заказ</button>
      </form>
      <button onClick={() => navigate('/profile')}>Назад</button>
    </div>
  );
}

export default OrderForm;