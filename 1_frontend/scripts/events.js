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

      allEvents.forEach((item) => {
        // console.log(item);

        const location = footballStadiums[item.location].name;

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
              <p>Players: ${item.players}/${item.numberOfPlayers}</p>
          </div>
        </div>
      <div class="eventStauts ${item.status}">
        <h4>${item.status}</h4>
        <button data-id=${item._id} class='joinBtn'>JOIN</button>
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
  const eventID = e.target.dataset.id;

  console.log(eventID);

  // Sending data to DB...
  // fetch()
};

// Events
document.addEventListener('DOMContentLoaded', renderAllEvents);
