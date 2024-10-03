const defaultUrl = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=25";
const completeDataUrl =
  "https://pokeapi.co/api/v2/pokemon/?limit=15000&offset=0";
const cards = document.querySelector(".cards-container");

import { pokemonTypes } from "./global-data.js";
function getPokemonInformation(url) {
  return fetch(url)
    .then((response) => response.json())
    .catch("Error fetching the api");
}

document.addEventListener("DOMContentLoaded", function () {
  getPokemonInformation(defaultUrl).then((data) => setPokemonCards(data));
});

async function setPokemonCards(pokemons) {
  pokemons.results.forEach((element) => {
    setPokemonCard(element.url, element.name);
  });
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
    let icon = document.createElement("i");

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
function getTypeIcon(icon) {}

function getStringUpperCase(string) {
  let newString = string[0].toUpperCase();
  for (let i = 1; i < string.length; i++) {
    newString += string[i].toLowerCase();
  }
  return newString;
}
