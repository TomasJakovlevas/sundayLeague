// Variables
// --DOM elements
const navElement = document.querySelector('nav');

// Functions
const renderNav = () => {
  // Creating HTML Elements
  const ul = document.createElement('ul');
  const li1 = document.createElement('li');
  const li2 = document.createElement('li');
  const li3 = document.createElement('li');
  const li4 = document.createElement('li');

  const a1 = document.createElement('a');
  const a2 = document.createElement('a');
  const a3 = document.createElement('a');
  const a4 = document.createElement('a');

  // -- adding content and atributes to created elements
  a1.href = location.href.includes('pages') ? '../index.html' : 'index.html';
  a1.innerHTML = '<i class="fas fa-home"></i>';

  a2.href = location.href.includes('pages')
    ? 'events.html'
    : './pages/events.html';
  a2.innerHTML = '<i class="fas fa-stream"></i>';

  a3.href = location.href.includes('pages')
    ? 'myGames.html'
    : './pages/myGames.html';
  a3.innerHTML = '<i class="fas fa-futbol"></i>';

  a4.href = location.href.includes('pages')
    ? 'profile.html'
    : './pages/profile.html';
  a4.innerHTML = '<i class="fas fa-user"></i>';

  // -- append elements
  li1.appendChild(a1);
  li2.appendChild(a2);
  li3.appendChild(a3);
  li4.appendChild(a4);

  ul.append(li1, li2, li3, li4);

  navElement.appendChild(ul);
};

// Events
document.addEventListener('DOMContentLoaded', renderNav);
