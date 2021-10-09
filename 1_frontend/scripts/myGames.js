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

// Local Variables
let events;

// Functions

const renderEvents = () => {
  fetch(`http://localhost:8080/user/events/${localUserID}`)
    .then((res) => res.json())
    .then((result) => {
      events = result;
      console.log(events);

      result.forEach((item) => {
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
        locationTitle.innerText = footballStadiums[item.location].name;
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
        } else if (item.status === 'completed  ') {
          status.innerText = 'Completed';
        }
        eventStatus.appendChild(status);

        eventInfo.append(eventMap, eventDetails);
        event.append(eventInfo, eventStatus);

        createdGamesContainer.append(event);
      });
    });
};

const onCreateGame = () => {
  createGameFormContainer.classList.remove('hidden');
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
    case 'voleyball':
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
  };

  fetch('http://localhost:8080/user/event/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })
    .then((res) => res.json())
    .then((result) => console.log(result));

  setTimeout(() => {
    createGameFormContainer.classList.add('hidden');
  }, 1000);
  createGameForm.reset();
};

const handleCanceledForm = () => {
  createGameFormContainer.classList.add('hidden');
};

const showEventDetails = (e) => {
  const itemIndex = e.target.dataset.index;
  const event = events[itemIndex];
  console.log(events);
  createdGameMoreInfoContainer.classList.remove('hidden');

  // Setting location
  let location;
  switch (event.category) {
    case 'football':
      location = footballStadiums[event.location];
      break;
    case 'basketball':
      location = basketballLot[event.location];
      break;
    case 'voleyball':
      location = volleyballCourt[event.location];
      break;
  }

  // Setting players
  const players = [{ name: 'Tomas' }, { name: 'Gintare' }, { name: 'Tadas' }];

  createdGameMoreInfoContainer.innerHTML = `
  <div class="createdGameDetails">
  <h2>${event.category}: ${location.district}</h2>
<h4>${event.date} || ${event.time}</h4>
<div><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5487.992559802447!2d25.293972326518986!3d54.66709635641924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dd944688f7acd3%3A0x8460aad5fe86f78!2sLFF%20stadionas!5e0!3m2!1slt!2slt!4v1630681268238!5m2!1slt!2slt" width="100%" height="200px" style="border:0;" allowfullscreen="" loading="lazy"></iframe></div>
<span>Kaina: ${event.price}€</span>
<span>${event.status}</span>
<div class="eventDetailsButtons">
 <button>Complete Game</button>
 <button>Cancel Game</button>
</div>
<p id='playerCounter'>Zaideju: ${event.players}/${event.numberOfPlayers}</p>
<ol id="playersList">
</ol>

<p>Eileje</p>
<ol id="playerQueue">
</ol>

<button id="closeEvent">x</button>

</div>
  `;

  // DOMelements
  const closeEventButton = document.getElementById('closeEvent');
  const playerListElement = document.getElementById('playersList');
  const playerQueueElement = document.getElementById('playerQueue');

  players.forEach((item) => {
    playerListElement.innerHTML += `
    <li>
      ${item.name}
    </li>
    `;
  });

  // Events
  closeEventButton.addEventListener('click', closeEvent);
};

const closeEvent = () => {
  createdGameMoreInfoContainer.classList.add('hidden');
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
