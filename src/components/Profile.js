import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    axios
      .get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/');
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!user) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Профиль пользователя</h1>
      <p>Email: {user.email}</p>
      <p>Реферальный код: {user.referral_code}</p>
      <p>Бонусы: {user.bonus_points}</p>
      <button onClick={() => navigate('/order')}>Создать заказ</button>
      <button onClick={() => navigate('/chat')}>Чат</button>
      <button onClick={logout}>Выйти</button>
    </div>
  );
}

export default Profile;