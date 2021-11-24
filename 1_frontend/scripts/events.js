// Imports
import {
  footballStadiums,
  basketballLot,
  volleyballCourt,
} from '../modules/locations.js';

// Variables
// DOMelements
const eventContainerElement = document.querySelector('.event__container');
const eventMoreInfoContainerElement = document.querySelector(
  '.eventMoreInfoContainer'
);
const bodyElement = document.querySelector('body');

// Local Variables
let allEvents;

// Functions
const renderAllEvents = () => {
  if (localStorage.getItem('user')) {
    fetch('http://localhost:8080/events/')
      .then((response) => response.json())
      .then((result) => {
        allEvents = result;
        eventContainerElement.innerText = '';

        allEvents.forEach((item) => {
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

          let playerExist = item.players.filter((item) => {
            return item.playerID === localStorage.getItem('user');
          });

          eventContainerElement.innerHTML += `
        <div class="event">
        <div class="eventInfo">
          <div class="eventMap ${item.category}">
          </div>
          <div class="eventDetails">
              <div>
                <h3 class='locationTitle' data-index=${allEvents.indexOf(
                  item
                )}>${location.name}</h3>
                <span>${item.date}</span>
              </div>
              <p>Players: ${item.players.length}/${item.numberOfPlayers}</p>
          </div>
        </div>
      <div class="eventStauts">
        <h4 class='${item.status}'> ${item.status.toUpperCase()}</h4>
        <button data-id=${item._id} class='btn joinBtn ${
            playerExist.length ? 'cancelButton' : 'joinButton'
          }'>${playerExist.length ? 'CANCEL' : 'JOIN'}</button>
      </div>
        `;
        });

        // buttons
        const joinBtn = document.querySelectorAll('.joinBtn');
        joinBtn.forEach((btn) => {
          btn.addEventListener('click', (e) => joinEvent(e));
        });

        // clickable title
        const locationTitles = document.querySelectorAll('.locationTitle');
        locationTitles.forEach((title) => {
          title.addEventListener('click', (e) => showEventDetails(e));
        });
      });
  } else {
    window.location.href = '../index.html';
  }
};

const joinEvent = (e) => {
  const data = {
    event: e.target.dataset.id,
    user: localStorage.getItem('user'),
  };

  // Sending data to DB
  fetch(`http://localhost:8080/user/event/`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.status === 'removed') {
        e.target.innerText = 'JOIN';
        renderAllEvents();
      } else if (result.status === 'joined') {
        e.target.innerText = 'CANCEL';
        renderAllEvents();
      }
    });
};

const showEventDetails = (e) => {
  const itemIndex = e.target ? e.target.dataset.index : e;
  const event = allEvents[itemIndex];
  eventMoreInfoContainerElement.classList.remove('hidden');
  eventContainerElement.style.display = 'none';
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

  eventMoreInfoContainerElement.innerHTML = `
  <div class="eventMoreInfo_details">
  <h2>${event.category}: ${location.district}</h2>
<h4>${event.date} || ${event.time}</h4>
<div><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5487.992559802447!2d25.293972326518986!3d54.66709635641924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dd944688f7acd3%3A0x8460aad5fe86f78!2sLFF%20stadionas!5e0!3m2!1slt!2slt!4v1630681268238!5m2!1slt!2slt" width="100%" height="200px" style="border:0;" allowfullscreen="" loading="lazy"></iframe></div>
<span>Organizer: ${event.creatorInfo}</span>
<div class='eventPriceAndStatus'>
<span>Price: ${event.price}€</span>
<span class='eventStatus' >${event.status}</span>
</div>

</>

<p id='playerCounter'>Players: ${event.players.length}/${event.numberOfPlayers}</p>
<ol id="playersList">
</ol>

<p>Queue</p>
<ol id="playerQueue">
</ol>

<p id='creatorComment'>Comment: ${event.comment}</p>

<div class="eventDetailsButtons">
<button data-id=${event._id} class='btn joinBtns'></button>
</div>
<button class="btn closeEvent">&#10006;</button>


</div>
  `;

  // DOMelements
  const playerListElement = document.getElementById('playersList');
  const playerQueueElement = document.getElementById('playerQueue');
  const joinBtns = document.querySelector('.joinBtns');
  const closeEventButton = document.querySelector('.closeEvent');

  // Logic
  const playerExist = event.players.find(
    (player) => player.playerID === localStorage.getItem('user')
  );

  // joinBtns.innerText = playerExist ? 'Cancel' : 'JOIN';
  if (playerExist) {
    joinBtns.classList.add('cancelButton');
    joinBtns.innerText = 'CANCEL';
  } else {
    joinBtns.classList.add('joinButton');
    joinBtns.innerText = 'JOIN';
  }

  const closeEvent = () => {
    eventMoreInfoContainerElement.classList.add('hidden');
    eventContainerElement.style.display = '';
    bodyElement.style.backgroundColor = 'white';
  };

  // Functions

  const renderList = () => {
    playerListElement.innerHTML = '';

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
  };

  const joinEventAndUpdate = (e) => {
    joinEvent(e);
    setTimeout(() => {
      showEventDetails(itemIndex);
    }, 300);
  };

  // Events
  joinBtns.addEventListener('click', (e) => joinEventAndUpdate(e));
  closeEventButton.addEventListener('click', closeEvent);
  renderList();
};

// Events
document.addEventListener('DOMContentLoaded', renderAllEvents);
