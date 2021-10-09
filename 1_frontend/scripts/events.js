// Imports
import {
  footballStadiums,
  basketballLot,
  volleyballCourt,
} from '../modules/locations.js';

// Variables
// DOMelements
const eventContainerElement = document.querySelector('.event__container');

// Functions
const renderAllEvents = () => {
  fetch('http://localhost:8080/events/')
    .then((response) => response.json())
    .then((result) => {
      const allEvents = result;

      eventContainerElement.innerText = '';

      allEvents.forEach((item) => {
        const location = footballStadiums[item.location].name;

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
                <h3>${location}</h3>
                <span>${item.date}</span>
              </div>
              <p>Players: ${item.players.length}/${item.numberOfPlayers}</p>
          </div>
        </div>
      <div class="eventStauts ${item.status}">
        <h4>${item.status}</h4>
        <button data-id=${item._id} class='joinBtn'>${
          playerExist.length ? 'CANCEL' : 'JOIN'
        }</button>
      </div>
        `;
      });

      // DOMelements
      const joinBtn = document.querySelectorAll('.joinBtn');
      joinBtn.forEach((btn) => {
        btn.addEventListener('click', (e) => joinEvent(e));
      });
    });
};

const joinEvent = (e) => {
  const data = {
    event: e.target.dataset.id,
    user: localStorage.getItem('user'),
  };

  // Sending data to DB...
  fetch(`http://localhost:8080/user/event/${data.event}`, {
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

// Events
document.addEventListener('DOMContentLoaded', renderAllEvents);
