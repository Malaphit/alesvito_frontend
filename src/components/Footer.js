import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Контакты</h3>
          <p>Email: support@handiworkvitorio.com</p>
          <p>Телефон: +7 (999) 123-45-67</p>
        </div>
        <div className="footer-section">
          <h3>Информация</h3>
          <a href="/policy" target="_blank" rel="noopener noreferrer">
            Политика конфиденциальности
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Handiwork Vito Rio. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;