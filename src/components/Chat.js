import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [adminId, setAdminId] = useState(''); // Для примера, в реальной системе нужно выбирать админа
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    axios
      .get(`${API_URL}/chat`, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => setMessages(response.data))
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/');
      });
  }, [navigate]);

  const sendMessage = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/chat`, { adminId, message: newMessage }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewMessage('');
      const response = await axios.get(`${API_URL}/chat`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка');
    }
  };

  return (
    <div>
      <h1>Чат</h1>
      <div>
        <input
          type="text"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          placeholder="ID админа (для теста)"
        />
        <br />
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение"
        />
        <br />
        <button onClick={sendMessage}>Отправить</button>
      </div>
      <h2>Сообщения</h2>
      <ul>
        {messages.map(msg => (
          <li key={msg.id}>
            {msg.user_email || 'Вы'}: {msg.message} (Прочитано: {msg.is_read ? 'Да' : 'Нет'})
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/profile')}>Назад</button>
    </div>
  );
}

export default Chat;