// Imports
import { ADD_NEW_USER_URI } from '../modules/endpoints.js';

// Variables
// --DOMelements
const signupForm = document.querySelector('.signupForm form');
const formMessage = document.querySelector('#formMessage');

// Logic
let user;

// Functions
const createUser = (e) => {
  e.preventDefault();
  formMessage.innerText = '';

  // Check Password
  if (e.target.userPassword.value !== e.target.userPasswordCheck.value) {
    return (formMessage.innerText = 'Password needs to match');
  }

  // Create User
  user = {
    username: e.target.userName.value,
    email: e.target.userEmail.value,
    password: e.target.userPassword.value,
  };

  // Send User
  return fetch(ADD_NEW_USER_URI, {
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
        localStorage.setItem('user', JSON.stringify(data.userId));

        location.href = 'http://127.0.0.1:5500/1_frontend/pages/profile.html';
      }
    });
};

// Events
signupForm.addEventListener('submit', createUser);
