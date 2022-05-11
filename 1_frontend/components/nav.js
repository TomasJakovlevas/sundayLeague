// Variables
import { GET_USER, UPDATE_USER } from '../modules/endpoints.js';
import { profilePic } from '../modules/profilePic.js';

//
let params = new URLSearchParams(window.location.href);

console.log(params.toString());
//

// --DOM elements
const navElement = document.querySelector('nav');
const headerElement = document.querySelector('header');
const body = document.querySelector('body');

// user
let user;

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
    div.addEventListener('click', openProfileModal);
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
        user = result;
        const modal = document.querySelector('.profileModal');
        modal.innerHTML = `
          <ul class='profileModal-content'>
          <div>
          <li>
          <div class='profilePic' style='background-image: url(${
            user.profilePic
          })'></div>
          </li>
            <li class='profileUsername'>
            ${user.username.charAt(0).toUpperCase() + user.username.slice(1)}
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
  // some logic
  let profilePicture = user.profilePic;
  let profileUsername = user.username;
  let profilePhone = user.phoneNumber;

  // body.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

  const modal = document.createElement('div');
  modal.classList.add('editProfileContainer');

  modal.innerHTML = `
    <div>
    <form id='editProfileForm'>
    <div>
     <div class='editProfileImgContainer'>
     <div class='editProfileInnerWrapper'><div class='editProfileImg' style='background-image: url(${profilePicture})'></div>
     </div>
        
        <button class='btn changeProfilePic' type='button'>Change Profile Picture</button>
        <div class='imgSelect hidden'>
        </div>
      </div>
      <div class='editProfileSurnameContainer'>
      <div class='editProfileInnerWrapper'>
        <span class='profileSurname'>${profileUsername}</span>
        <input id='inputSurname' class='hidden' type='text' value='${profileUsername}'/>
        </div>
        <button class='btn changeProfieSurname' type='button'>Edit surname</button>
      </div>
      <div class='editProfilePhoneContainer'>
      <div class='editProfileInnerWrapper'>
        <span class='profilePhone'>${profilePhone}</span>
        <input id='inputPhone' class='hidden' type='number' value='${profilePhone}'/>
        </div>
      <button class='btn changeProfilePhone' type='button'>Edit phone</button>
    </div>
    <div class='errorMessage hidden'>
    <p>Sorry, something went wrong</p>
    </div>
    </div>
     

    <button class='btn saveEditProfile'>SAVE</button>
    </form>
    <button class="btn closeModal">&#10006;</button>

    </div>
  `;

  // DOM
  document.querySelector('main').appendChild(modal);
  document.body.classList.add('disableScroll');

  const closeBtn = document.querySelector('.closeModal');
  const changePicBtn = document.querySelector('.changeProfilePic');
  const imgSelect = document.querySelector('.imgSelect');
  const changeProfieSurnameBtn = document.querySelector('.changeProfieSurname');
  const changeProfilePhoneBtn = document.querySelector('.changeProfilePhone');
  const editProfileForm = document.getElementById('editProfileForm');

  // Functions
  const changeProfilePic = (e) => {
    if (imgSelect.classList.contains('hidden')) {
      imgSelect.classList.remove('hidden');
      e.target.innerText = 'Save changes';

      if (imgSelect.firstElementChild) return;

      profilePic.forEach((pic) => {
        let div = document.createElement('div');
        div.classList.add('selectProfileImg');
        div.style = `background-image: url(${pic.url})`;
        div.addEventListener('click', changeToMainPic);
        div.dataset.pic = pic.url;
        imgSelect.appendChild(div);
      });
    } else {
      imgSelect.classList.add('hidden');
      e.target.innerText = 'Change Profile Picture';
    }
  };

  const changeToMainPic = (e) => {
    document.querySelector(
      '.editProfileImg'
    ).style = `background-image: url(${e.target.dataset.pic})`;
    profilePicture = e.target.dataset.pic;
  };

  const editSurname = (e) => {
    const input = document.getElementById('inputSurname');
    const label = document.querySelector('.profileSurname');

    if (input.classList.contains('hidden')) {
      input.classList.remove('hidden');
      input.focus();
      label.classList.add('hidden');
      e.target.innerText = 'Save changes';
    } else {
      input.classList.add('hidden');
      label.classList.remove('hidden');

      profileUsername = input.value;
      label.innerText = profileUsername;
      e.target.innerText = 'Edit surname';
    }
  };

  const editPhone = (e) => {
    const input = document.getElementById('inputPhone');
    const label = document.querySelector('.profilePhone');

    if (input.classList.contains('hidden')) {
      input.classList.remove('hidden');
      input.focus();
      label.classList.add('hidden');
      e.target.innerText = 'Save changes';
    } else {
      input.classList.add('hidden');
      label.classList.remove('hidden');

      profilePhone = input.value;
      label.innerText = profilePhone;
      e.target.innerText = 'Edit phone';
    }
  };

  const handleEditedForm = (e) => {
    e.preventDefault();
    const userID = localStorage.getItem('user');

    const updateFields = {
      profileUsername,
      profilePicture,
      profilePhone,
    };

    // update user
    fetch(UPDATE_USER + userID, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updateFields),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message === 'success') {
          window.location = window.location;
        } else {
          const errMessage = document.querySelector('.errorMessage');
          errMessage.classList.remove('hidden');
          setTimeout(() => errMessage.classList.add('hidden'), 3000);
        }
      });
  };

  // Events
  closeBtn.addEventListener('click', closeEditProfile);
  changePicBtn.addEventListener('click', changeProfilePic);
  changeProfieSurnameBtn.addEventListener('click', editSurname);
  changeProfilePhoneBtn.addEventListener('click', editPhone);
  editProfileForm.addEventListener('submit', handleEditedForm);
};

const closeEditProfile = () => {
  const modal = document.querySelector('.editProfileContainer');
  const main = document.querySelector('main');
  body.style.backgroundColor = 'white';

  main.removeChild(modal);
  document.body.classList.remove('disableScroll');
};

// Events
document.addEventListener('DOMContentLoaded', renderNav);
