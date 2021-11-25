// Variables
import { GET_USER } from '../modules/endpoints.js';

// --DOM elements
const navElement = document.querySelector('nav');
const headerElement = document.querySelector('header');

// Functions
const renderNav = () => {
  // Creating HTML Elements
  let ulMob = document.createElement('ul');

  let li2 = document.createElement('li');
  let li3 = document.createElement('li');
  let li4 = document.createElement('li');

  let a2 = document.createElement('a');
  let a3 = document.createElement('a');
  let a4 = document.createElement('span');

  // -- adding content and atributes to created elements
  a2.href = location.href.includes('pages')
    ? 'events.html'
    : './pages/events.html';
  a2.innerHTML = '<i class="fas fa-home"></i>';

  a3.href = location.href.includes('pages')
    ? 'myGames.html'
    : './pages/myGames.html';
  a3.innerHTML = '<i class="fas fa-futbol"></i>';

  // a4.href = location.href.includes('pages')
  //   ? 'profile.html'
  //   : './pages/profile.html';
  a4.innerHTML = '<i class="fas fa-user"></i>';

  // -- append elements
  li2.appendChild(a2);
  li3.appendChild(a3);
  li4.appendChild(a4);

  ulMob.append(li2, li3, li4);
  ulMob.classList.add('mobileNav');

  navElement.appendChild(ulMob);

  const profileContainer = document.createElement('div');
  profileContainer.classList.add('profileModal', 'hidden');

  headerElement.appendChild(profileContainer);

  // from Tablet breakpont

  let logo = document.createElement('div');
  let ulTab = document.createElement('ul');

  let li2Tab = document.createElement('li');
  let li3Tab = document.createElement('li');
  let li4Tab = document.createElement('li');

  let a2Tab = document.createElement('a');
  let a3Tab = document.createElement('a');
  let profileBtn = document.createElement('button');

  // -- adding content and atributes to created elements
  a2Tab.href = location.href.includes('pages')
    ? 'events.html'
    : './pages/events.html';
  a2Tab.innerHTML = 'EVENTS';

  a3Tab.href = location.href.includes('pages')
    ? 'myGames.html'
    : './pages/myGames.html';
  a3Tab.innerHTML = 'MY GAMES';

  // profileBtn.href = location.href.includes('pages')
  //   ? 'profile.html'
  //   : './pages/profile.html';
  profileBtn.innerHTML = 'PROFILE';

  // -- append elements
  li2Tab.appendChild(a2Tab);
  li3Tab.appendChild(a3Tab);
  li4Tab.appendChild(profileBtn);

  ulTab.append(li2Tab, li3Tab, li4Tab);
  ulTab.classList.add('ulTab');

  logo.classList.add('logo');
  logo.innerText = 'SundayLeague';

  navElement.append(logo, ulTab);

  // Events
  a4.addEventListener('click', openProfileModal);
  profileBtn.addEventListener('click', openProfileModal);

  getProfileInfo();
};

const openProfileModal = () => {
  const modal = document.querySelector('.profileModal');
  const mainElement = document.querySelector('main');

  if (modal.classList.contains('hidden')) {
    modal.classList.remove('hidden');
    mainElement.classList.add('blur');

    let div = document.createElement('div');
    div.className += 'overlay';
    document.body.appendChild(div);
    document.body.classList.add('disableScroll');
  } else {
    modal.classList.add('hidden');
    mainElement.classList.remove('blur');

    let div = document.querySelector('.overlay');
    document.body.removeChild(div);
    document.body.classList.remove('disableScroll');
  }
};

const getProfileInfo = () => {
  const userID = localStorage.getItem('user');

  if (userID) {
    fetch(GET_USER + userID)
      .then((response) => response.json())
      .then((result) => {
        const modal = document.querySelector('.profileModal');
        modal.innerHTML = `
          <ul class='profileModal-content'>
          <div>
          <li>
          <div class='profilePic'></div>
          </li>
            <li class='profileUsername'>
            ${
              result.username.charAt(0).toUpperCase() + result.username.slice(1)
            }
            </li>
          </div>
          
            <div class='profileActionsDiv'>
              <li class='editProfile'>
                Edit Profile
              </li>
              <li class='logout'>
              Log out
              </li>
            </div>
          </ul>
        `;

        // DOM elements
        const editBtn = document.querySelector('.editProfile');
        const logoutBtn = document.querySelector('.logout');

        // events
        editBtn.addEventListener('click', handleEditBtn);
        logoutBtn.addEventListener('click', logoutUser);
      });

    const handleEditBtn = () => {
      openProfileModal();
      openEditProfile();
    };

    const logoutUser = () => {
      localStorage.removeItem('user');
      window.location.href = '../index.html';
    };
  }
};

const openEditProfile = () => {
  const modal = document.createElement('div');
  modal.classList.add('editProfileContainer');

  modal.innerHTML = `
    <h3>Laba diena su vistiena</h3>
    <button class="btn closeEvent">&#10006;</button>
  `;

  document.querySelector('main').appendChild(modal);
  document.body.classList.add('disableScroll');

  const closeBtn = document.querySelector('.closeEvent');
  closeBtn.addEventListener('click', closeEditProfile);
};

const closeEditProfile = () => {
  const modal = document.querySelector('.editProfileContainer');
  const main = document.querySelector('main');

  main.removeChild(modal);
  document.body.classList.remove('disableScroll');
};

// Events
document.addEventListener('DOMContentLoaded', renderNav);
