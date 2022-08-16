// Constants values
const API_BASE_URL = "https://pokeapi.co/api/v2";

// DOM elements
const pokemonCardDetails = document.querySelector('.pokemon-card-details');

let appState = {
  dark_mode: false,
  favorite_pokemons: [],
  pokemon_team: []
};

let loadingData = false;

// Async functions
const searchPokemon = async (searchTerm) => {
  let pokemon = {};
  try {
    loadingData = true;
    drawSpinner();
    const resp = await fetch(`${API_BASE_URL}/pokemon/${searchTerm}/`);
    const pokemon = await resp.json();
    pokemonInfo = {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.sprites.other.dream_world.front_default,
      hp_points: pokemon.stats[0].base_stat,
      stats: [...pokemon.stats],
      experience_points: pokemon.base_experience,
    };
    drawPokemonCard(pokemonInfo);
  } catch (error) {
    console.log("Request error: ", error);
    drawPokemonCard(pokemonInfo, true);
  } finally {
    loadingData = false;
    drawSpinner();
  }
};

// Manipulation DOM functions
const drawPokemonCard = (pokemon, error) => {
  const pokemonCardTemplate = document.querySelector( "#pokemon-card-template").content;
  const pokemonCardFragment = document.createDocumentFragment();
  const pokemonCardClone = pokemonCardTemplate.cloneNode(true);
  if (!error) {
    pokemonCardClone.querySelector('.pokemon-card__img').setAttribute("src", pokemon.image);
    pokemonCardClone.querySelector('.pokemon-card__name').textContent = pokemon .name;
    pokemon.stats.forEach(stat => {
      pokemonCardClone.querySelector('.pokemon-details-table__body').innerHTML +=  `
      <tr class="pokemon-details-table__row">
        <td class="pokemon-details-table__data pokemon-details-table__data--stat-name">${stat.stat.name}</td>
        <td class="pokemon-details-table__data pokemon-details-table__data--stat-value">${stat.base_stat}</td>
      </tr>`;
    })
  } else {
    pokemonCardClone.querySelector('.pokemon-card__img').setAttribute("src", '../assets/img/not-found.png');
    pokemonCardClone.querySelector('.pokemon-card__img').classList.add('pokemon-card__img--not-found');
    pokemonCardClone.querySelector('.pokemon-card__name').textContent = 'Not pokemons found :(';
  }
  pokemonCardFragment.appendChild(pokemonCardClone);
  pokemonCardDetails.appendChild(pokemonCardFragment);
};

const drawSpinner = () => {
  const spinnerMask = document.querySelector('.spinner-mask');
  if (!loadingData) {
    spinnerMask.classList.add('spinner-mask--hide');
  } else {
    spinnerMask.classList.remove('spinner-mask--hide');
  }
}

const removeChildNodes = (parentElement) => {
  while (parentElement.firstElementChild) {
    parentElement.removeChild(parentElement.firstElementChild);
  }
}

// Events
// Excecute JS when DOM is loaded!
document.addEventListener('DOMContentLoaded', () => {
  const queryStringParams = window.location.search 
  const queryParams = new URLSearchParams(queryStringParams)
  if (queryParams.has('pokemon_id')) {
    const pokemonId = queryParams.get('pokemon_id');
    searchPokemon(pokemonId);
  }
  if (localStorage.getItem('app_state')) {
    appState = JSON.parse(localStorage.getItem('app_state'));
    console.log(appState);
  }
});

// Pokemon Cards evenets
pokemonCardDetails.addEventListener('click', (e) => {
  // Pokemon search button
  if (e.target.classList.contains('pokemon-search-form__submit-button')) {
    e.preventDefault();
    const pokemonSearchInput = document.querySelector('.pokemon-search-form__imput');
    const pokemonSerachInputFeedback = document.querySelector('.pokemon-search-form__imput-feedback'); 
    const pokemonSearchTerm = pokemonSearchInput.value.toLowerCase();
    const isValidField = validateSearchInput(pokemonSearchInput, pokemonSerachInputFeedback);
    if (isValidField) {
      removeChildNodes(pokemonCardDetails);
      searchPokemon(pokemonSearchTerm);
    }
  }
});
