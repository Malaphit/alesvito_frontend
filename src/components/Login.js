import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegister ? `${API_URL}/users/register` : `${API_URL}/users/login`;
    const data = isRegister ? { email, password, referralCode } : { email, password };

    try {
      const response = await axios.post(url, data);
      if (isRegister) {
        alert('Регистрация успешна! Войдите в систему.');
        setIsRegister(false);
      } else {
        localStorage.setItem('token', response.data.token);
        navigate(response.data.role === 'admin' ? '/admin' : '/profile');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка');
    }
  };

  return (
    <div>
      <h1>{isRegister ? 'Регистрация' : 'Вход'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
        />
        <br />
        {isRegister && (
          <>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="Реферальный код (опционально)"
            />
            <br />
          </>
        )}
        <button type="submit">{isRegister ? 'Зарегистрироваться' : 'Войти'}</button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
      </button>
    </div>
  );
}

export default Login;