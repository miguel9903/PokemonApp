// Constants values
const API_BASE_URL = "https://pokeapi.co/api/v2";

// DOM elements
const favoritePokemonsList = document.querySelector(".pokemon-list");
const pokemonTeamTable = document.querySelector('.pokemon-team-table');
const pokemonTeamTableBody = document.querySelector('.pokemon-team-table__tbody');

let appState = {
  dark_mode: false,
  favorite_pokemons: [],
  pokemon_team: []
};

const addPokemonToTeam = (pokemon) => {
  const { pokemon_team } = appState;
  const existInTeam = pokemon_team.find(p => p.id == pokemon.id);
  if (!existInTeam) {
    const newAppState = {
      ...appState,
      pokemon_team: [...appState.pokemon_team, pokemon]
    };
    appState = {...newAppState};
    localStorage.setItem('app_state', JSON.stringify(newAppState));
    removeChildNodes(pokemonTeamTableBody);
    drawPokemonTeamTable(appState.pokemon_team);
  }
}

const deletePokemonToTeam = (pokemonId) => {
  const { pokemon_team } = appState;
  const existInTeam = pokemon_team.find(p => p.id == pokemonId);
  if (existInTeam) {
    const newAppState = {
      ...appState,
      pokemon_team: appState.pokemon_team.filter(p => p.id != pokemonId)
    };
    appState = {...newAppState};
    localStorage.setItem('app_state', JSON.stringify(newAppState));
    removeChildNodes(pokemonTeamTableBody);
    drawPokemonTeamTable(appState.pokemon_team);
  }
}

const deletePokemonToFavorites = (pokemonId) => {
  console.log(pokemonId);
  const { pokemon_team } = appState;
  const existInTeam = pokemon_team.find(p => p.id == pokemonId);
  const newAppState = {
    ...appState,
    favorite_pokemons: appState.favorite_pokemons.filter(p => p.id != pokemonId)
  };
  appState = {...newAppState};
  localStorage.setItem('app_state', JSON.stringify(newAppState));
  deletePokemonToTeam(pokemonId);
  removeChildNodes(favoritePokemonsList);
  removeChildNodes(pokemonTeamTableBody);
  drawPokemonTeamTable(appState.pokemon_team);
  drawFavoritePokemonsList(appState.favorite_pokemons);
}

// Manipulation DOM functions
const drawFavoritePokemonsList = (pokemons) => {
  const pokemonCardTemplate = document.querySelector( "#pokemon-card-template").content;
  const pokemonCardFragment = document.createDocumentFragment();
  if (pokemons.length > 0) {
    pokemons.forEach(pokemon => {
      const pokemonCardClone = pokemonCardTemplate.cloneNode(true);
      pokemonCardClone.querySelector('.pokemon-card').setAttribute("id", pokemon.id);
      pokemonCardClone.querySelector('.pokemon-card__thumbnail').setAttribute("src", pokemon.image);
      pokemonCardClone.querySelector('.pokemon-card__title').innerHTML = `${pokemon.name} <span class="pokemon-card__power-points">${pokemon.hp_points} Hp</span>`;
      pokemonCardClone.querySelector('.pokemon-card__experience-points').textContent = `${pokemon.experience_points}Exp`;
      pokemonCardFragment.appendChild(pokemonCardClone);
    });
    favoritePokemonsList.appendChild(pokemonCardFragment);
  } else {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'The favorite pokemon list is empty!'
    emptyMessage.classList.add('pokemon-card__empty-message');
    pokemonCardFragment.appendChild(emptyMessage);
    favoritePokemonsList.appendChild(pokemonCardFragment);
    favoritePokemonsList.style.display = 'block';
  }
}

drawPokemonTeamTable = (pokemons) => {
  const pokemonTableRowTemplate = document.querySelector( "#pokemon-team-table-row-template").content;
  const pokemonTableRowFragment = document.createDocumentFragment();
  if (pokemons.length > 0) {
    pokemonTeamTable.classList.remove('pokemon-team-table--hide');
    document.querySelector('.secondary-title').classList.remove('secondary-title--hide');
    pokemons.forEach(pokemon => {
      const pokemonTeamTableRowClone = pokemonTableRowTemplate.cloneNode(true);
      pokemonTeamTableRowClone.querySelector('.pokemon-team-table__row').setAttribute("id", pokemon.id);
      pokemonTeamTableRowClone.querySelector('.pokemon-team-table__image').setAttribute("src", pokemon.image);
      pokemonTeamTableRowClone.querySelectorAll('td')[1].textContent = pokemon.name;
      pokemonTeamTableRowClone.querySelectorAll('td')[2].textContent = pokemon.hp_points;
      pokemonTeamTableRowClone.querySelectorAll('td')[3].textContent = pokemon.attack_points;
      pokemonTeamTableRowClone.querySelectorAll('td')[4].textContent = pokemon.defense_points;
      pokemonTeamTableRowClone.querySelectorAll('td')[5].textContent = pokemon.speed_points;
      pokemonTableRowFragment.appendChild(pokemonTeamTableRowClone);
    });
    pokemonTeamTableBody.appendChild(pokemonTableRowFragment);
  } else {
    pokemonTeamTable.classList.add('pokemon-team-table--hide');
    document.querySelector('.secondary-title').classList.add('secondary-title--hide');
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
  if (localStorage.getItem('app_state')) {
    appState = JSON.parse(localStorage.getItem('app_state'));
  }
  drawFavoritePokemonsList(appState.favorite_pokemons);
  drawPokemonTeamTable(appState.pokemon_team);
});

// Pokemon Cards events
favoritePokemonsList.addEventListener('click', async (e) => {
  // Add to favorites button event
  if (e.target.classList.contains('pokemon-card__close-icon')) {
    const deleteFavoritePokemonButton = e.target.parentElement;
    const pokemonId = deleteFavoritePokemonButton.parentElement.parentElement.id;
    deletePokemonToFavorites(pokemonId);
  }
  // Add to pokemon team event
  if (e.target.classList.contains('pokemon-card__add-button-img')) {
    const addToTeamButton = e.target.parentElement;
    const pokemonId = addToTeamButton.parentElement.parentElement.id;
    const pokemonToAdd = appState.favorite_pokemons.find(p => p.id == pokemonId);
    addPokemonToTeam(pokemonToAdd);
  }
  // Show pokemon detail event
  if (e.target.classList.contains('pokemon-card__show-details-button')) {
    const showPokemonDetailButton = e.target;
    const pokemonId = showPokemonDetailButton.parentElement.parentElement.id;
    showPokemonDetailButton.setAttribute("href", `../pages/pokemon.html?pokemon_id=${pokemonId}`);
  }
  e.stopPropagation();
});

pokemonTeamTableBody.addEventListener('click', (e) => {
  // Delete pokemon team event
  if (e.target.classList.contains('pokemon-team-table__delete-image')) {
    const deleteTeamButon =  e.target.parentElement;;
    const pokemonId = deleteTeamButon.parentElement.parentElement.id;
    deletePokemonToTeam(pokemonId);
  }
  e.stopPropagation();
});

