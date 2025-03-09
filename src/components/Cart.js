import React, { useState, useEffect } from 'react';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  return (
    <div className="cart">
      <h2>Корзина</h2>
      {cart.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <div>
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <p>Товар ID: {item.productId}</p>
              <p>Размер: {item.size}</p>
              <p>Количество: {item.quantity}</p>
            </div>
          ))}
          <button>Оформить заказ</button>
        </div>
      )}
    </div>
  );
};

export default Cart;