import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.css';

const API_URL = 'http://localhost:5000/api';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/chat`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Ошибка загрузки сообщений');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      setError('Сообщение не может быть пустым');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/chat`,
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage('');
      const response = await axios.get(`${API_URL}/chat`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка отправки сообщения');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="chat-container">
      <h1>Чат</h1>
      <div className="messages-container">
        {messages.length > 0 ? (
          <ul className="messages-list">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className={`message-item ${msg.sender_role === 'user' ? 'user' : 'admin'}`}
              >
                <span className="message-sender">
                  {msg.sender_role === 'user'
                    ? 'Вы'
                    : `${msg.admin_first_name || ''} ${msg.admin_last_name || ''}`.trim() ||
                      msg.admin_email}
                  :
                </span>{' '}
                {msg.message}{' '}
                {msg.sender_role === 'user' && (
                  <span className="message-status">
                    ({msg.is_read ? 'Прочитано' : 'Не прочитано'})
                  </span>
                )}
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
        ) : (
          <p>Сообщений нет</p>
        )}
      </div>
      <div className="input-container">
        <textarea
          className="message-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение"
          disabled={loading}
        />
        <button className="send-button" onClick={sendMessage} disabled={loading}>
          Отправить
        </button>
      </div>
    </div>
  );
}

export default Chat;