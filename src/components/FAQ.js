import React from 'react';
import './FAQ.css';

const FAQ = () => {
  const faqs = [
    { question: 'Как сделать заказ?', answer: 'Выберите товар, добавьте в корзину и нажмите "Оформить заказ".' },
    { question: 'Как отслеживать заказ?', answer: 'После оформления заказа вам будет отправлено письмо с трек-номером.' },
    { question: 'Возврат товара?', answer: 'Возврат возможен в течение 14 дней с момента получения.' },
  ];

  return (
    <div className="faq">
      <h2>Часто задаваемые вопросы</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
      <div className="chat-placeholder">
        <p>Чат поддержки (в разработке)</p>
      </div>
    </div>
  );
};

export default FAQ;