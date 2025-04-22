import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [addressForm, setAddressForm] = useState({
    city: '',
    street: '',
    house: '',
    building: '',
    apartment: '',
    postalCode: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [userRes, ordersRes, addressesRes] = await Promise.all([
          axios.get(`${API_URL}/users/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/addresses`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setUser(userRes.data);
        setOrders(ordersRes.data);
        setAddresses(addressesRes.data);
        setProfileForm({
          firstName: userRes.data.first_name || '',
          lastName: userRes.data.last_name || '',
          phone: userRes.data.phone || '',
        });
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    fetchData();
  }, [navigate]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `${API_URL}/users/profile`,
        {
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          phone: profileForm.phone,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      alert('Профиль обновлён');
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка');
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${API_URL}/addresses`,
        addressForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses([...addresses, response.data]);
      setAddressForm({
        city: '',
        street: '',
        house: '',
        building: '',
        apartment: '',
        postalCode: '',
      });
      alert('Адрес добавлен');
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка');
    }
  };

  const handleAddressUpdate = async (addressId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `${API_URL}/addresses/${addressId}`,
        addressForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(addresses.map((addr) => (addr.id === addressId ? response.data : addr)));
      setAddressForm({
        city: '',
        street: '',
        house: '',
        building: '',
        apartment: '',
        postalCode: '',
      });
      alert('Адрес обновлён');
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!user) return <div>Загрузка...</div>;

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '200px', borderRight: '1px solid #ccc', padding: '10px' }}>
        <h2>Меню</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <button
              style={{
                background: activeTab === 'profile' ? '#ccc' : 'none',
                border: 'none',
                padding: '10px',
                width: '100%',
                textAlign: 'left',
              }}
              onClick={() => setActiveTab('profile')}
            >
              Профиль
            </button>
          </li>
          <li>
            <button
              style={{
                background: activeTab === 'address' ? '#ccc' : 'none',
                border: 'none',
                padding: '10px',
                width: '100%',
                textAlign: 'left',
              }}
              onClick={() => setActiveTab('address')}
            >
              Адрес
            </button>
          </li>
          <li>
            <button
              style={{
                background: activeTab === 'orders' ? '#ccc' : 'none',
                border: 'none',
                padding: '10px',
                width: '100%',
                textAlign: 'left',
              }}
              onClick={() => setActiveTab('orders')}
            >
              Заказы
            </button>
          </li>
          <li>
            <button
              style={{
                background: activeTab === 'chat' ? '#ccc' : 'none',
                border: 'none',
                padding: '10px',
                width: '100%',
                textAlign: 'left',
              }}
              onClick={() => navigate('/chat')}
            >
              Чат
            </button>
          </li>
          <li>
            <button
              style={{ border: 'none', padding: '10px', width: '100%', textAlign: 'left' }}
              onClick={logout}
            >
              Выйти
            </button>
          </li>
        </ul>
      </div>

      <div style={{ flex: 1, padding: '20px' }}>
        {activeTab === 'profile' && (
          <div>
            <h1>Профиль</h1>
            <p>Email: {user.email}</p>
            <p>Реферальный код: {user.referral_code}</p>
            <p>Бонусы: {user.bonus_points}</p>
            <h2>Редактировать профиль</h2>
            <form onSubmit={handleProfileSubmit}>
              <div>
                <label>Имя:</label>
                <input
                  type="text"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  placeholder="Введите имя"
                />
              </div>
              <div>
                <label>Фамилия:</label>
                <input
                  type="text"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  placeholder="Введите фамилию"
                />
              </div>
              <div>
                <label>Телефон:</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="Введите номер телефона"
                />
              </div>
              <button type="submit">Сохранить</button>
            </form>
          </div>
        )}

        {activeTab === 'address' && (
          <div>
            <h1>Адреса доставки</h1>
            <h2>Добавить/редактировать адрес</h2>
            <form onSubmit={handleAddressSubmit}>
              <div>
                <label>Город:</label>
                <input
                  type="text"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  placeholder="Санкт-Петербург"
                  required
                />
              </div>
              <div>
                <label>Улица:</label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  placeholder="Невский проспект"
                  required
                />
              </div>
              <div>
                <label>Дом:</label>
                <input
                  type="text"
                  value={addressForm.house}
                  onChange={(e) => setAddressForm({ ...addressForm, house: e.target.value })}
                  placeholder="10"
                  required
                />
              </div>
              <div>
                <label>Корпус:</label>
                <input
                  type="text"
                  value={addressForm.building}
                  onChange={(e) => setAddressForm({ ...addressForm, building: e.target.value })}
                  placeholder="1"
                />
              </div>
              <div>
                <label>Квартира:</label>
                <input
                  type="text"
                  value={addressForm.apartment}
                  onChange={(e) => setAddressForm({ ...addressForm, apartment: e.target.value })}
                  placeholder="5"
                />
              </div>
              <div>
                <label>Почтовый индекс:</label>
                <input
                  type="text"
                  value={addressForm.postalCode}
                  onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                  placeholder="190000"
                />
              </div>
              <button type="submit">Добавить</button>
            </form>
            <h2>Сохранённые адреса</h2>
            {addresses.length > 0 ? (
              <ul>
                {addresses.map((addr) => (
                  <li key={addr.id}>
                    {addr.city}, ул. {addr.street}, д. {addr.house}
                    {addr.building ? `, корп. ${addr.building}` : ''}
                    {addr.apartment ? `, кв. ${addr.apartment}` : ''}{' '}
                    {addr.postalCode ? `(индекс: ${addr.postalCode})` : ''}
                    <button
                      onClick={() => {
                        setAddressForm({
                          city: addr.city,
                          street: addr.street,
                          house: addr.house,
                          building: addr.building || '',
                          apartment: addr.apartment || '',
                          postalCode: addr.postalCode || '',
                        });
                        handleAddressUpdate(addr.id);
                      }}
                    >
                      Редактировать
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Адресов нет</p>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h1>Мои заказы</h1>
            {orders.length > 0 ? (
              <ul>
                {orders.map((order) => (
                  <li key={order.id}>
                    Заказ #{order.id} | Сумма: {order.total_price} руб. | Статус: {order.status} | Адрес:{' '}
                    {order.city
                      ? `${order.city}, ул. ${order.street}, д. ${order.house}${order.building ? ', корп. ' + order.building : ''}${order.apartment ? ', кв. ' + order.apartment : ''}`
                      : 'Не указан'}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Заказов нет</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;