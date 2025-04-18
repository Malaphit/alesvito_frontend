import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Chat.css'; // Добавим стили

const API_URL = 'http://localhost:5000/api';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    axios
      .get(`${API_URL}/chat`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setMessages(response.data))
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/');
      });
  }, [navigate]);

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      alert('Сообщение не может быть пустым');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `${API_URL}/chat`,
        { message: newMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewMessage('');
      const response = await axios.get(`${API_URL}/chat`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка при отправке сообщения');
    }
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">Чат с поддержкой</h1>
      <div className="messages-container">
        {messages.length > 0 ? (
          <ul className="messages-list">
            {messages.map((msg) => (
              <li key={msg.id} className={`message-item ${msg.user_id ? 'user' : 'admin'}`}>
                <span className="message-sender">{msg.user_email || 'Вы'}:</span>{' '}
                {msg.message}{' '}
                <span className="message-status">
                  (Прочитано: {msg.is_read ? 'Да' : 'Нет'})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-messages">Сообщений пока нет</p>
        )}
      </div>
      <div className="input-container">
        <textarea
          className="message-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение"
        />
        <button className="send-button" onClick={sendMessage}>
          Отправить
        </button>
      </div>
      <button className="back-button" onClick={() => navigate('/profile')}>
        Назад
      </button>
    </div>
  );
}

export default Chat;