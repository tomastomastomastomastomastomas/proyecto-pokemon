const defaultUrl = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=25";
const completeDataUrl =
  "https://pokeapi.co/api/v2/pokemon/?limit=15000&offset=0";
const cards = document.querySelector(".cards-container");
const searchButton = document.querySelector(".search-button");
const searchInput = document.querySelector(".search-input");
const backButton = document.querySelector(".back-button");
const nextButton = document.querySelector(".next-button");
const loading = document.querySelector(".loading");
let globalPokemonData = [];
getPokemonInformation(completeDataUrl)
  .then((data) => {
    globalPokemonData = data;
  })
  .catch("Error fetching the api");
let actualPokemons = { pokemons: [], offset: 0 };

function getPokemonInformation(url) {
  loading.style.display = "flex";
  return fetch(url)
    .then((response) => response.json())
    .catch("Error fetching the api")
    .finally(() => (loading.style.display = "none"));
}

document.addEventListener("DOMContentLoaded", function () {
  getPokemonInformation(completeDataUrl).then((data) => {
    globalPokemonData = data;
    actualPokemons.pokemons = globalPokemonData.results;
    setPokemonCards({ pokemons: data.results, offset: 0 });
  });
});

searchButton.addEventListener("click", function () {
  actualPokemons.pokemons = [];
  globalPokemonData.results.forEach(function (value) {
    if (value.name.includes(searchInput.value)) {
      actualPokemons.pokemons.push(value);
    }
  });
  actualPokemons.offset = 0;
  setPokemonCards(actualPokemons);
});

async function setPokemonCards(pokemons) {
  cards.innerHTML = "";
  for (let i = pokemons.offset * 25; i < pokemons.offset * 25 + 25; i++) {
    if (!pokemons.pokemons[i]) {
      break;
    }
    setPokemonCard(pokemons.pokemons[i].url, pokemons.pokemons[i].name);
  }
}

async function setPokemonCard(url, name) {
  let div = document.createElement("div");
  div.classList.add("pokemon-card");
  cards.append(div);

  let pokemonData = await getPokemonInformation(url);
  let pokemonName = document.createElement("span");
  let pokemonImg = document.createElement("img");

  pokemonName.textContent = getStringUpperCase(name);
  pokemonImg.src = pokemonData.sprites.other["official-artwork"].front_default;
  let pokemonType = setPokemonTypes(pokemonData);

  div.append(pokemonImg);
  div.append(pokemonName);
  div.append(pokemonType);
}

function setPokemonTypes(pokemonData) {
  let pokemonTypes = document.createElement("div");
  pokemonTypes.classList.add("types-container");

  getPokemonTypes(pokemonData).forEach(function (pokemonType) {
    let container = document.createElement("div");
    let type = document.createElement("span");

    container.classList.add("type-container");

    type.textContent = getStringUpperCase(pokemonType);
    type.classList.add(pokemonType);
    container.append(type);
    pokemonTypes.append(container);
  });
  return pokemonTypes;
}
function getPokemonTypes(pokemonData) {
  return pokemonData.types.map(function (type) {
    return type.type.name;
  });
}

function getStringUpperCase(string) {
  let newString = string[0].toUpperCase();
  for (let i = 1; i < string.length; i++) {
    newString += string[i].toLowerCase();
  }
  return newString;
}

nextButton.addEventListener("click", function () {
  actualPokemons.offset += 1;
  if (actualPokemons.offset < Math.ceil(actualPokemons.pokemons.length / 25)) {
    setPokemonCards(actualPokemons);
  } else {
    actualPokemons.offset -= 1;
  }
});

backButton.addEventListener("click", function () {
  if (actualPokemons.offset > 0) {
    actualPokemons.offset -= 1;
    setPokemonCards(actualPokemons);
  }
});
