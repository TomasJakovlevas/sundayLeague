// Imports
import { GET_USER } from '../modules/endpoints.js';

// Variables
// -- DOMelements

const nameElement = document.querySelector('#profileUserName');
const profileStatusElement = document.querySelector('.profileStatus');

// Functions
const renderProfile = () => {
  const userID = localStorage.getItem('user');

  if (userID) {
    fetch(GET_USER + userID)
      .then((response) => response.json())
      .then((result) => {
        nameElement.innerText =
          result.username.charAt(0).toUpperCase() + result.username.slice(1);

        profileStatusElement.innerHTML = `
        <div class="profileStatus__actionButtons">
          <button class="btn">Edit Profile</button>
          <button class="btn logout">Log Out</button>
        </div>
        `;

        // DOMelements
        const logoutBtn = document.querySelector('.logout');
        logoutBtn.addEventListener('click', logoutUser);
      });
  } else {
    window.location.href = '../index.html';
  }
};

const logoutUser = () => {
  localStorage.removeItem('user');
  window.location.href = '../index.html';
};

// Events
document.addEventListener('DOMContentLoaded', renderProfile);
