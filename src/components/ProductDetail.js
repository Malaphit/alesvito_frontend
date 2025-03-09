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
        const res = await axios.get(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(res.data);
        setSelectedImage(res.data.image_urls[0] || '/placeholder.jpg');
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id, token]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Пожалуйста, выберите размер');
      return;
    }
    const cartItem = { productId: product.id, size: selectedSize, quantity: 1 };
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Товар добавлен в корзину!');
    navigate('/cart');
  };

  if (!product) return <div>Загрузка...</div>;

  return (
    <div className="product-detail">
      <h1>{product.name}</h1>
      <div className="product-content">
        <div className="product-images">
          <img src={selectedImage} alt={product.name} className="main-image" />
          <div className="thumbnail-gallery">
            {product.image_urls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${product.name} ${index}`}
                className="thumbnail"
                onClick={() => setSelectedImage(url)}
              />
            ))}
          </div>
        </div>
        <div className="product-info">
          <p>Цена: {product.price} руб.</p>
          <p>Описание: {product.description}</p>
          <div className="size-selector">
            <label>Размер:</label>
            <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
              <option value="">Выберите размер</option>
              {product.sizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.name}
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