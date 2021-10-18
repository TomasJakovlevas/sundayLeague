// Variables
// --DOM elements
const navElement = document.querySelector('nav');

// Functions
const renderNav = () => {
  // Creating HTML Elements
  let ulMob = document.createElement('ul');

  let li2 = document.createElement('li');
  let li3 = document.createElement('li');
  let li4 = document.createElement('li');

  let a2 = document.createElement('a');
  let a3 = document.createElement('a');
  let a4 = document.createElement('a');

  // -- adding content and atributes to created elements
  a2.href = location.href.includes('pages')
    ? 'events.html'
    : './pages/events.html';
  a2.innerHTML = '<i class="fas fa-home"></i>';

  a3.href = location.href.includes('pages')
    ? 'myGames.html'
    : './pages/myGames.html';
  a3.innerHTML = '<i class="fas fa-futbol"></i>';

  a4.href = location.href.includes('pages')
    ? 'profile.html'
    : './pages/profile.html';
  a4.innerHTML = '<i class="fas fa-user"></i>';

  // -- append elements
  li2.appendChild(a2);
  li3.appendChild(a3);
  li4.appendChild(a4);

  ulMob.append(li2, li3, li4);
  ulMob.classList.add('mobileNav');

  navElement.appendChild(ulMob);

  // from Tablet breakpont

  let logo = document.createElement('div');
  let ulTab = document.createElement('ul');

  let li2Tab = document.createElement('li');
  let li3Tab = document.createElement('li');
  let li4Tab = document.createElement('li');

  let a2Tab = document.createElement('a');
  let a3Tab = document.createElement('a');
  let a4Tab = document.createElement('a');

  // -- adding content and atributes to created elements
  a2Tab.href = location.href.includes('pages')
    ? 'events.html'
    : './pages/events.html';
  a2Tab.innerHTML = 'EVENTS';

  a3Tab.href = location.href.includes('pages')
    ? 'myGames.html'
    : './pages/myGames.html';
  a3Tab.innerHTML = 'MY GAMES';

  a4Tab.href = location.href.includes('pages')
    ? 'profile.html'
    : './pages/profile.html';
  a4Tab.innerHTML = 'PROFILE';

  // -- append elements
  li2Tab.appendChild(a2Tab);
  li3Tab.appendChild(a3Tab);
  li4Tab.appendChild(a4Tab);

  ulTab.append(li2Tab, li3Tab, li4Tab);
  ulTab.classList.add('ulTab');

  logo.classList.add('logo');
  logo.innerText = 'SundayLeague';

  navElement.append(logo, ulTab);
};

// Events
document.addEventListener('DOMContentLoaded', renderNav);
