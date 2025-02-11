import React from 'react';

const Contact = () => {
  return (
    <div>
      <h2>Contact Us</h2>
      <p>Reach out to us via Facebook or WhatsApp:</p>
      <ul>
        <li>
          <a 
            href="https://web.facebook.com/profile.php?id=61571918573862" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Facebook
          </a>
        </li>
        <li>
          <a 
            href="https://api.whatsapp.com/send?phone=08032913274" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Contact;