import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AdminChat.scss';

const API_URL = 'http://localhost:5000/api';

function AdminChat() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
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

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/chat/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Ошибка загрузки пользователей');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;

    const token = localStorage.getItem('token');
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/chat?userId=${selectedUserId}`, {
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
  }, [selectedUserId]);

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
        { message: newMessage, targetUserId: selectedUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage('');
      const messagesResponse = await axios.get(`${API_URL}/chat?userId=${selectedUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(messagesResponse.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка отправки сообщения');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${API_URL}/chat/${messageId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const response = await axios.get(`${API_URL}/chat?userId=${selectedUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-chat-container">
      <h2>Чат с клиентами</h2>
      <div className="chat-layout">
        <div className="users-panel">
          <h3>Клиенты</h3>
          {users.length > 0 ? (
            <ul className="users-list">
              {users.map((user) => (
                <li
                  key={user.id}
                  className={`user-item ${selectedUserId === user.id ? 'selected' : ''}`}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user.email}
                </li>
              ))}
            </ul>
          ) : (
            <p>Клиентов с сообщениями нет</p>
          )}
        </div>
        <div className="messages-panel">
          {selectedUserId ? (
            <>
              <div className="messages-container">
                {messages.length > 0 ? (
                  <ul className="messages-list">
                    {messages.map((msg) => (
                      <li
                        key={msg.id}
                        className={`message-item ${msg.sender_role === 'admin' ? 'admin' : 'user'}`}
                      >
                        <span className="message-sender">
                          {msg.sender_role === 'admin'
                            ? `${msg.admin_first_name || ''} ${msg.admin_last_name || ''}`.trim() ||
                              msg.admin_email
                            : `${msg.user_first_name || ''} ${msg.user_last_name || ''}`.trim() ||
                              msg.user_email}
                          :
                        </span>{' '}
                        {msg.message}{' '}
                        {msg.sender_role === 'user' && (
                          <span className="message-status">
                            ({msg.is_read ? 'Прочитано' : 'Не прочитано'})
                          </span>
                        )}
                        {msg.sender_role === 'user' && !msg.is_read && (
                          <button onClick={() => markAsRead(msg.id)}>Отметить как прочитанное</button>
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
            </>
          ) : (
            <p>Выберите клиента для просмотра сообщений</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminChat;