// Imports
import {
  footballStadiums,
  basketballLot,
  volleyballCourt,
} from '../modules/locations.js';

// Variables
// DOM elements
const localUserID = localStorage.getItem('user');
const createGameBtn = document.querySelector('.createGame');
const createGameFormContainer = document.querySelector(
  '.createGameFormContainer'
);
const createGameForm = document.querySelector('.createGameFormContainer form');
const gameCategory = document.getElementById('gameCategory');
const gameLocation = document.getElementById('gameLocation');
const diffLocation = document.getElementById('diffLocation');
const cancelForm = document.getElementById('cancelForm');
const createdGamesContainer = document.querySelector('.createdGames');
const createdGameMoreInfoContainer = document.querySelector(
  '.createdGameMoreInfoContainer'
);
const bodyElement = document.querySelector('body');

// Local Variables
let events;

// Functions

const renderEvents = () => {
  if (localUserID) {
    createdGamesContainer.innerText = '';

    fetch(`http://localhost:8080/user/events/${localUserID}`)
      .then((res) => res.json())
      .then((result) => {
        events = result;

        events.forEach((item) => {
          // Displaying created games
          const event = document.createElement('div');
          event.classList.add('event');

          const eventInfo = document.createElement('div');
          eventInfo.classList.add('eventInfo');

          const eventMap = document.createElement('div');
          eventMap.classList.add('eventMap', item.category);

          const eventDetails = document.createElement('div');
          eventDetails.classList.add('eventDetails');

          const eventDetailsChild = document.createElement('div');
          const locationTitle = document.createElement('h3');
          // Setting location
          let location;
          switch (item.category) {
            case 'football':
              location = footballStadiums[item.location];
              break;
            case 'basketball':
              location = basketballLot[item.location];
              break;
            case 'volleyball':
              location = volleyballCourt[item.location];
              break;
          }

          locationTitle.innerText = location ? location.name : item.location;

          locationTitle.dataset.index = result.indexOf(item);

          // Event listener
          locationTitle.addEventListener('click', (e) => showEventDetails(e));

          const dateTitle = document.createElement('span');
          dateTitle.innerText = item.date + ' || ' + item.time;

          const playerCount = document.createElement('div');
          const counter = document.createElement('p');
          counter.innerText = `Players: ${item.players.length}/${item.numberOfPlayers}`;
          playerCount.appendChild(counter);

          eventDetailsChild.append(locationTitle, dateTitle);
          eventDetails.append(eventDetailsChild, playerCount);

          const eventStatus = document.createElement('div');
          eventStatus.classList.add('eventStauts');
          const status = document.createElement('h4');

          if (item.status === 'ongoing') {
            status.innerText = 'On Going';
          } else if (item.status === 'completed') {
            status.innerText = 'Completed';
          } else if (item.status === 'canceled') {
            status.innerText = 'Canceled';
          }

          eventStatus.appendChild(status);

          eventInfo.append(eventMap, eventDetails);
          event.append(eventInfo, eventStatus);

          createdGamesContainer.append(event);
        });
      });
  } else {
    window.location.href = '../index.html';
  }
};

const onCreateGame = () => {
  createGameFormContainer.classList.remove('hidden');
  createdGamesContainer.style.display = 'none';
  createGameBtn.style.display = 'none';
  bodyElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
};

// render locations based on category
const handleCategoryChange = (e) => {
  gameLocation.innerHTML = `
  <option value="" selected disabled hidden>Choose here</option>
  `;

  switch (e.target.value) {
    case 'football':
      gameLocation.innerHTML += footballStadiums.reduce((total, current) => {
        return (total += `<option value="${current._id}">${current.name}</option>`);
      }, '');
      break;
    case 'basketball':
      gameLocation.innerHTML += basketballLot.reduce((total, current) => {
        return (total += `<option value="${current._id}">${current.name}</option>`);
      }, '');
      break;
    case 'volleyball':
      gameLocation.innerHTML += volleyballCourt.reduce((total, current) => {
        return (total += `<option value="${current._id}">${current.name}</option>`);
      }, '');
      break;
    default:
      return;
  }
};

// creating and sending event to db
const onCreateGameSubmit = (e) => {
  e.preventDefault();

  let location =
    e.target.diffLocation.value !== ''
      ? e.target.diffLocation.value
      : e.target.gameLocation.value;

  const event = {
    creatorID: localStorage.getItem('user'),
    location: location,
    date: e.target.gameDate.value,
    time: e.target.gameTime.value,
    category: e.target.gameCategory.value,
    price: +e.target.gamePrice.value,
    numberOfPlayers: +e.target.gamePlayers.value,
    comment: e.target.gameComment.value,
  };

  fetch('http://localhost:8080/user/event/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })
    .then((res) => res.json())
    .then((result) => {
      setTimeout(() => {
        // createGameFormContainer.classList.add('hidden');
        handleCanceledForm();
        createGameForm.reset();
        renderEvents();
      }, 300);
    });
};

const handleCanceledForm = () => {
  createGameFormContainer.classList.add('hidden');
  createdGamesContainer.style.display = 'flex';
  createGameBtn.style.display = 'flex';
  bodyElement.style.backgroundColor = 'white';
};

const showEventDetails = (e) => {
  const itemIndex = e.target ? e.target.dataset.index : e;
  const event = events[itemIndex];
  createdGameMoreInfoContainer.classList.remove('hidden');
  createdGamesContainer.style.display = 'none';
  createGameBtn.style.display = 'none';
  bodyElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';

  // Setting location
  let location;
  switch (event.category) {
    case 'football':
      location = footballStadiums[event.location];
      break;
    case 'basketball':
      location = basketballLot[event.location];
      break;
    case 'volleyball':
      location = volleyballCourt[event.location];
      break;
  }

  createdGameMoreInfoContainer.innerHTML = `
  <div class="createdGameDetails">
  <h2>${location ? location.district : event.location}</h2>
<h4 class='eventDateAndTime'>${event.date} || ${event.time}</h4>
<div>${location ? location.location : `<div class='imgContainer'></div>`}</div>
<div class='eventPriceAndStatus'><span>Price: ${event.price}€</span>
<span id='eventStatus'>${event.status}</span>
</div>

<div class="eventDetailsButtons">
 <button class='completeGameBtn'>Complete Game</button>
 <button class='cancelGameBtn'>Cancel Game</button>
 <button class='deleteGameBtn'>Delete Game</button>

</div>
<div class='delete-confirmation-container hidden'>
  <p class='delete-confirmation-p'>Are you sure want to delete this event?</p>
  <div>
    <button id='confirmDelete' class='btn' data-index=${itemIndex}>YES</button>
    <button id='cancelDelete' class='btn'>CANCEL</button>
  </div>
</div>
<p id='playerCounter'>Players: ${event.players.length}/${
    event.numberOfPlayers
  }</p>
<ol id="playersList">
</ol>

<p>Queue</p>
<ol id="playerQueue">
</ol>

<p id=' '>Comment: ${event.comment}</p>

<button class="btn closeEvent">x</button>

</div>
  `;

  // DOMelements
  const eventStatusElement = document.getElementById('eventStatus');
  const closeEventButton = document.querySelector('.closeEvent');
  const playerListElement = document.getElementById('playersList');
  const playerQueueElement = document.getElementById('playerQueue');
  const completeGameBtn = document.querySelector('.completeGameBtn');
  const cancelGameBtn = document.querySelector('.cancelGameBtn');
  const deleteGameBtn = document.querySelector('.deleteGameBtn');
  const deleteConfirmationElement = document.querySelector(
    '.delete-confirmation-container'
  );
  const confirmBtn = document.querySelector('#confirmDelete');
  const cancelDeleteBtn = document.querySelector('#cancelDelete');

  for (let x = 0; x < event.players.length; x++) {
    if (x < event.numberOfPlayers) {
      playerListElement.innerHTML += `
      <li>
        ${event.players[x].username}
      </li>
      `;
    } else {
      playerQueueElement.innerHTML += `
      <li>
        ${event.players[x].username}
      </li>
      `;
    }
  }

  // Functions
  const completeGame = (status) => {
    fetch('http://localhost:8080/user/event/status/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: event._id,
        status: status,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message === 'success') {
          eventStatusElement.innerText = result.newStatus;
        }
      });

    setTimeout(() => {
      renderEvents();
    }, 300);
  };

  const askBeforeDelete = () =>
    deleteConfirmationElement.classList.remove('hidden');

  const closeAskBeforeDelete = () => {
    deleteConfirmationElement.classList.add('hidden');
  };

  const deleteGame = (e) => {
    const currentItemIndex = e.target.dataset.index;
    let itemToDelete = events[currentItemIndex];

    fetch(`http://localhost:8080/user/event/${itemToDelete._id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 'success') {
          closeEvent();
          renderEvents();
        }
      });
  };

  // Events
  closeEventButton.addEventListener('click', closeEvent);
  completeGameBtn.addEventListener('click', () => completeGame('completed'));
  cancelGameBtn.addEventListener('click', () => completeGame('canceled'));
  deleteGameBtn.addEventListener('click', (e) => askBeforeDelete(e));
  confirmBtn.addEventListener('click', (e) => deleteGame(e));
  cancelDeleteBtn.addEventListener('click', () => closeAskBeforeDelete());
};

const closeEvent = () => {
  createdGameMoreInfoContainer.classList.add('hidden');
  createdGamesContainer.style.display = '';
  createGameBtn.style.display = 'flex';
  bodyElement.style.backgroundColor = 'white';
};

// Events
document.addEventListener('DOMContentLoaded', renderEvents);
createGameBtn.addEventListener('click', onCreateGame);
createGameForm.addEventListener('submit', onCreateGameSubmit);
cancelForm.addEventListener('click', handleCanceledForm);
diffLocation.addEventListener('keyup', (e) => {
  if (diffLocation.value) {
    gameLocation.disabled = true;
  } else {
    gameLocation.disabled = false;
  }
});
gameCategory.addEventListener('change', handleCategoryChange);
