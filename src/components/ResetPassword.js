import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/users/reset-password?token=${token}`, { newPassword }, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Пароль успешно сброшен! Войдите с новым паролем.');
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка');
    }
  };

  return (
    <div>
      <h1>Сброс пароля</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Новый пароль"
          required
        />
        <br />
        <button type="submit">Сбросить пароль</button>
      </form>
    </div>
  );
}

export default ResetPassword;