import React, { useState, useEffect } from 'react';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  return (
    <div className="cart">
      <h2>Корзина</h2>
      {cart.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <div>
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <p>Товар: {item.name || `ID: ${item.productId}`}</p>
              <p>Размер: {item.size}</p>
              <p>Количество: {item.quantity}</p>
              <p>Цена: {(item.price || 0) * item.quantity} руб.</p>
              <button onClick={() => removeFromCart(index)}>Удалить</button>
            </div>
          ))}
          <div className="cart-total">
            <h3>Итог: {totalPrice} руб.</h3>
            <button onClick={() => alert('Оформление заказа в разработке')}>
              Оформить заказ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;