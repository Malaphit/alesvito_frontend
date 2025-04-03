import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

const API_URL = 'http://localhost:5000/api';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/users/reset-password`, { email });
      alert('Инструкции по восстановлению пароля отправлены на ваш email.');
      navigate('/');
    } catch (error) {
      alert('Ошибка при отправке запроса. Проверьте email.');
    }
  };

  return (
    <div className="reset-container">
      <form className="reset-form" onSubmit={handleSubmit}>
        <h2>Восстановление пароля</h2>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="reset-button">Отправить</button>
        <a href="/" className="back-link">Вернуться к входу</a>
      </form>
    </div>
  );
};

export default ResetPassword;