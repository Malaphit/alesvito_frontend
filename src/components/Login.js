import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegister ? `${API_URL}/users/register` : `${API_URL}/users/login`;
    const data = isRegister ? { email, password, referralCode } : { email, password };

    try {
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' },
      });
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/users/forgot-password`, { email }, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Письмо для сброса пароля отправлено');
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка');
    }
  };

  return (
    <div>
      <h1>{isForgotPassword ? 'Восстановление пароля' : isRegister ? 'Регистрация' : 'Вход'}</h1>
      {isForgotPassword ? (
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <br />
          <button type="submit">Отправить</button>
          <button onClick={() => setIsForgotPassword(false)}>Назад</button>
        </form>
      ) : (
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
      )}
      {!isForgotPassword && (
        <>
          <button onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </button>
          <br />
          <button onClick={() => setIsForgotPassword(true)}>Забыли пароль?</button>
        </>
      )}
    </div>
  );
}

export default Login;