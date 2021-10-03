// Imports
import { GET_USER } from '../modules/endpoints.js';

// Variables
const nameElement = document.querySelector('#profileUserName');

// Functions
const renderProfile = () => {
  const userID = localStorage.getItem('user');
  fetch(GET_USER + userID)
    .then((response) => response.json())
    .then((result) => {
      nameElement.innerText =
        result.username.charAt(0).toUpperCase() + result.username.slice(1);
    });
};

// Events
document.addEventListener('DOMContentLoaded', renderProfile);
