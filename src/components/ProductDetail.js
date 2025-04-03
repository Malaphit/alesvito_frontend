import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

const API_URL = 'http://localhost:5000/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log(`Fetching product with ID: ${id}`);
        const response = await axios.get(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` || '' },
        });
        console.log('Product data:', response.data);
        const data = response.data;
        const imageUrls = Array.isArray(data.image_urls) ? data.image_urls : [];
        setProduct({ ...data, image_urls: imageUrls });
        setSelectedImage(imageUrls[0] || '/placeholder.jpg');
      } catch (error) {
        console.error('Error fetching product:', error.response ? error.response.data : error.message);
        alert(`Товар с ID ${id} не найден. Ошибка: ${error.message}`);
      }
    };
    fetchProduct();
  }, [id, token]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Пожалуйста, выберите размер');
      return;
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      size: selectedSize,
      quantity: 1, // По умолчанию 1, можно добавить изменение количества позже
      price: parseFloat(product.price), // Преобразуем цену в число
    };

    // Получаем текущую корзину из localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Проверяем, есть ли уже такой товар с таким размером
    const existingItemIndex = cart.findIndex(
      (item) => item.productId === cartItem.productId && item.size === cartItem.size
    );
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1; // Увеличиваем количество, если товар уже есть
    } else {
      cart.push(cartItem); // Добавляем новый товар
    }

    // Сохраняем обновленную корзину
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Товар добавлен в корзину!');
    navigate('/cart'); // Перенаправляем в корзину (опционально)
  };

  if (!product) return <div>Загрузка...</div>;

  return (
    <div className="product-detail">
      <h1>{product.name}</h1>
      <div className="product-content">
        <div className="product-images">
          <img src={selectedImage} alt={product.name} className="main-image" />
          <div className="thumbnail-gallery">
            {Array.isArray(product.image_urls) && product.image_urls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${product.name} ${index + 1}`}
                className="thumbnail"
                onClick={() => setSelectedImage(url)}
              />
            ))}
          </div>
        </div>
        <div className="product-info">
          <p>Цена: {product.price} руб.</p>
          <p>Описание: {product.description || 'Нет описания'}</p>
          <p>Категория: {product.category_name || 'Не указана'}</p>
          <div className="size-selector">
            <label>Размер:</label>
            <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
              <option value="">Выберите размер</option>
              {Array.isArray(product.sizes) && product.sizes.map((size) => (
                <option key={size.id} value={size.size}>
                  {size.size}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleAddToCart} className="add-to-cart">
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;