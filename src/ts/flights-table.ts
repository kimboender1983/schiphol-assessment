import { FetchType, Flight, SearchObject, View } from '../types';
import API from './api';

/*
  DOM Selectors
*/
const input: HTMLInputElement = document.querySelector(
  '.destination-airport-input'
);
const viewToggle: HTMLElement = document.querySelector('.view-toggle');
const flightsHolder: HTMLElement = document.querySelector('.flights-holder');
const flightsTable: HTMLElement = document.querySelector('#flights-table');
const flightsTableTbody: HTMLElement = flightsTable.querySelector('tbody');
const flightsCards: HTMLElement = document.querySelector('.flights-cards');

// View mode
let view: View = View.cards;

// Boolean indicating if first call to the api
let initialCall: boolean = true;

// Collection of flights
let flights: Flight[] = null;
let initialFlights: Flight[] = null;

// DOM Parser
const parser = new DOMParser();

// Update UI
const updateUI = () => {
  flightsHolder.classList[view === View.table ? 'add' : 'remove']('table');
  viewToggle.classList[view === View.table ? 'add' : 'remove']('table');
};

// Search function
const search = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const query: string = target.value.length > 2 ? target.value : '';

  // Fetch results from API
  fetchResults({
    query,
    type: FetchType.query,
  });
};

// Fetch results
const fetchResults = async (searchObject: SearchObject) => {
  // Set flights
  flights = await API.getFlights(searchObject);

  // Check if this is the first call (initialCall);
  if (initialCall) {
    initialFlights = flights;
    initialCall = false;
  }

  // If the response is null, set initialFlights to flights
  if (flights === null) {
    flights = initialFlights;
  }

  // Generate HTML
  generateHTML();
};

// Function to generate table- or cards-view
const generateHTML = () => {
  // Clear existing results
  flightsTableTbody.innerHTML = null;
  flightsCards.innerHTML = null;

  // No results? -> return
  if (flights.length === 0) return;

  // Generate html based on view
  if (view === View.table) {
    generateTable();
  } else {
    generateCards();
  }
};

// Generate table-view
const generateTable = () => {
  // Loop over flights to create table rows
  flights.forEach(flight => {
    // Create table row
    const tr = document.createElement('tr');

    // Create array of table cells with values from flights
    const tds: HTMLElement[] = Object.values(flight).map(value => {
      const td = document.createElement('td');
      td.textContent = value;
      return td;
    });

    // Append table cells to rows
    tds.forEach(td => {
      tr.append(td);
    });

    // Push table row to tbody
    flightsTableTbody.append(tr);
  });
};

// Generate cards-view
const generateCards = () => {
  flights.forEach(flight => {
    // highlightText(flight.airport);
    const card = `
    <li>
      <dl>
        <div>
          <dt>Flight identifier</dt>
          <dd>
            <span>${flight.flightIdentifier}</span>
          </dd>
        </div>
        <div>
          <dt>Flight number</dt>
          <dd>
            <span>${flight.flightNumber}</span>
          </dd>
        </div>
        <div>
          <dt>Airport</dt>
          <dd>
            <span>${flight.airport}</span>
          </dd>
        </div>
        <div>
          <dt>Arrival</dt>
          <dd>
            <span>Expected time </span>
            <time>${flight.expectedTime}</time>
          </dd>
        </div>
      </dl>
    </li>
    `;

    // Parse string to HTML
    const parsedCard = parser.parseFromString(card, 'text/html');

    // Fill cards list
    flightsCards.append(parsedCard.body);
  });
};

// Add eventListener for search input
input.addEventListener('input', search);

// Add listener to view-button
viewToggle.addEventListener('click', () => {
  // Set view to corresponding enum
  view = view === View.table ? View.cards : View.table;

  // Update UI based on toggle
  updateUI();

  // Generate html for the chosen view
  generateHTML();
});

// First load -> get all results
fetchResults({
  query: '',
  type: FetchType.all,
});
