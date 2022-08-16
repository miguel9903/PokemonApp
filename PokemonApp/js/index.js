// Constants values
const API_BASE_URL = "https://pokeapi.co/api/v2";

const pagination = {
  limit: 6,
  offset: 0,
  loading: false,
  currentPage: 1,
  numberOfPages: 0,
};

let appState = {
  dark_mode: false,
  favorite_pokemons: [],
  pokemon_team: []
};

let favoritePokemons = [];


// DOM elements references
const pokemonList = document.querySelector(".pokemon-list");
const paginationPrevButton = document.querySelector('.pokemon-pagination__prev-button');
const paginationNextButton = document.querySelector('.pokemon-pagination__next-button');

// Async functions
const getPokemonList = async (limit, offset = 0) => {
  try {
    pagination.loading = true;
    drawSpinner();
    const resp = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    const pokemons = await resp.json();
    pokemons.results.forEach(pokemon => {
      getAndDrawPokemonInfo(pokemon.url);
    });
    pagination.numberOfPages = Math.ceil(pokemons.count / pagination.limit);
    drawPaginationValues();
  } catch (error) {
    console.log("Request error: ", error);
  } finally {
    pagination.loading = false;
    drawSpinner();
  }
};

const getAndDrawPokemonInfo = async (pokemonUrl) => {
  try {
    const pokeminInfo = await getPokemonById(pokemonUrl);
    drawPokemonCard(pokeminInfo);
  } catch (error) {
    console.log("Request error: ", error);
  }
};

const getPokemonById = async (pokemonUrl) => {
  let pokemonInfo = {};
  try {
    const resp =  await fetch(pokemonUrl);;
    const pokemon = await resp.json();
    pokemonInfo = {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.sprites.other.dream_world.front_default,
      hp_points: pokemon.stats[0].base_stat,
      attack_points: pokemon.stats[1].base_stat,
      defense_points: pokemon.stats[2].base_stat,
      speed_points: pokemon.stats[5].base_stat,
      experience_points: pokemon.base_experience,
    };
    return pokemonInfo;
  } catch (error) {
    console.log("Request error: ", error);
  }
}

// LocalStorage functions
const addFavoritePokemon = (pokemon) => {
  const { favorite_pokemons } = appState;
  const existInFavorites = favorite_pokemons.find(p => p.id === pokemon.id);
  if (!existInFavorites) {
    const newAppState = {
      ...appState,
      favorite_pokemons: [...favorite_pokemons, pokemon]
    };
    appState = {...newAppState};
    localStorage.setItem('app_state', JSON.stringify(newAppState));
  }
  swal('Pokemon added to favorites!');
}

// Manipulation DOM functions
const drawPokemonCard = (pokemon) => {
  const pokemonCardTemplate = document.querySelector( "#pokemon-card-template").content;
  const pokemonCardFragment = document.createDocumentFragment();
  const pokemonCardClone = pokemonCardTemplate.cloneNode(true);
  pokemonCardClone.querySelector('.pokemon-card').setAttribute("id", pokemon.id);
  pokemonCardClone.querySelector('.pokemon-card__thumbnail').setAttribute("src", pokemon.image);
  pokemonCardClone.querySelector('.pokemon-card__title').innerHTML = `${pokemon.name} <span class="pokemon-card__power-points">${pokemon.hp_points} Hp</span>`;
  pokemonCardClone.querySelector('.pokemon-card__experience-points').textContent = `${pokemon.experience_points}Exp`;
  pokemonCardClone.querySelectorAll('.pokemon-card__skill-number')[0].textContent = pokemon.attack_points;
  pokemonCardClone.querySelectorAll('.pokemon-card__skill-number')[1].textContent = pokemon.defense_points;
  pokemonCardClone.querySelectorAll('.pokemon-card__skill-number')[2].textContent = pokemon.speed_points;
  pokemonCardFragment.appendChild(pokemonCardClone);
  pokemonList.appendChild(pokemonCardFragment);
};

const drawPaginationValues = () => {
  const { currentPage, numberOfPages } = pagination;
  const paginationCurrentPage = document.querySelector('.pokemon-pagination__current-page');
  const paginationNumberOfPages = document.querySelector('.pokemon-pagination__number-of-pages');
  paginationCurrentPage.textContent = currentPage;
  paginationNumberOfPages.textContent = numberOfPages;
}

const drawSpinner = () => {
  const { loading } = pagination;
  const spinnerMask = document.querySelector('.spinner-mask');
  if (!loading) {
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
  const { limit, offset } = pagination;
  if (localStorage.getItem('app_state')) {
    appState = JSON.parse(localStorage.getItem('app_state'));
    console.log(appState);
  }
  getPokemonList(limit, offset);
});

// Pagination events
paginationPrevButton.addEventListener('click', () => {
  const { currentPage, limit } = pagination;
  if (currentPage > 1) {
    pagination.currentPage -= 1;
    pagination.offset -= pagination.limit;
    removeChildNodes(pokemonList);
    getPokemonList(limit, pagination.offset);
    drawPaginationValues();
  }
});

paginationNextButton.addEventListener('click', () => {
  const { limit } = pagination;
  pagination.currentPage += 1;
  pagination.offset += pagination.limit;
  removeChildNodes(pokemonList);
  getPokemonList(limit, pagination.offset);
  drawPaginationValues();
});

// Pokemon Cards events
pokemonList.addEventListener('click', async (e) => {
  // Add to favorites button event
  if (e.target.classList.contains('pokemon-card__favorite-icon')) {
    const addToFavoritesIcon = e.target;
    const pokemonId = addToFavoritesIcon.parentElement.parentElement.id;
    const pokemonToAdd = await getPokemonById(`${API_BASE_URL}/pokemon/${pokemonId}/`);
    addToFavoritesIcon.setAttribute("src", "./assets/img/favorite.png");
    addFavoritePokemon(pokemonToAdd);
  }
  // Show pokemon detail button event
  if (e.target.classList.contains('pokemon-card__show-details-button')) {
    const showPokemonDetailButton = e.target;
    const pokemonId = showPokemonDetailButton.parentElement.parentElement.id;
    showPokemonDetailButton.setAttribute("href", `./pages/pokemon.html?pokemon_id=${pokemonId}`);
  }
  e.stopPropagation();
});
