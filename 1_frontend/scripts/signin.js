// Imports
import { LOGIN_USER_URI } from '../modules/endpoints.js';

// Variables
// --DOMelements
const loginForm = document.querySelector('.loginForm form');
const formMessage = document.querySelector('#formMessage');

// Functions
const checkForUser = () => {
  const user = localStorage.getItem('user');

  if (user) {
    location.href = 'http://127.0.0.1:5500/1_frontend/pages/mygames.html';
  }
};

const loginUser = (e) => {
  e.preventDefault();
  formMessage.innerText = '';

  const user = {
    email: e.target.userEmail.value,
    password: e.target.userPassword.value,
  };

  fetch(LOGIN_USER_URI, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 'failed') {
        e.target.userEmail.focus();
        formMessage.innerText = data.message;
      } else if (data.status === 'success') {
        localStorage.setItem('user', data.userId);

        location.href = 'http://127.0.0.1:5500/1_frontend/pages/mygames.html';
      }
    });
};

// Events
document.addEventListener('DOMContentLoaded', checkForUser);
loginForm.addEventListener('submit', loginUser);
