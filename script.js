const defaultUrl = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=25";
const completeDataUrl =
  "https://pokeapi.co/api/v2/pokemon/?limit=15000&offset=0";
const cards = document.querySelector(".cards-container");
const searchButton = document.querySelector(".search-button");
const searchInput = document.querySelector(".search-input");
const backButton = document.querySelector(".back-button");
const nextButton = document.querySelector(".next-button");
const loading = document.querySelector(".loading");
const main = document.querySelector("main");
const header = document.querySelector("header");
const panel = document.querySelector(".panel-information-container");
const closePanelButton = document.querySelector(".panel-close-btn");
const panelBack = document.querySelector(".panel-back");

let globalPokemonData = [];
getPokemonInformation(completeDataUrl).then((data) => {
  globalPokemonData = data;
});
let actualPokemons = { pokemons: [], offset: 0 };

import { pokemonTypes } from "./global-data.js";

function getPokemonInformation(url) {
  return fetch(url)
    .then((response) => response.json())
    .catch("Error fetching the api");
}

document.addEventListener("DOMContentLoaded", function () {
  getPokemonInformation(completeDataUrl).then((data) => {
    globalPokemonData = data;
    actualPokemons.pokemons = globalPokemonData.results;
    setPokemonCards({ pokemons: data.results, offset: 0 });
  });
});

searchButton.addEventListener("click", function () {
  searchPokemon(searchInput.value);
});

function searchPokemon(search) {
  searchInput.value = "";
  clearFilter();
  actualPokemons.pokemons = [];
  globalPokemonData.results.forEach(function (value) {
    if (value.name.includes(search)) {
      actualPokemons.pokemons.push(value);
    }
  });
  if (search.trim() !== "") {
    addFilterElement(search);
  }
  actualPokemons.offset = 0;
  setPokemonCards(actualPokemons);
}

function addFilterElement(search) {
  let span = document.createElement("span");
  span.innerHTML = `<button class="filter-close-btn">
        <i class="fa-solid fa-x filter-close-icon"></i>
      </button> ${search}`;
  span
    .querySelector(".filter-close-btn")
    .addEventListener("click", function () {
      clearFilter();
    });
  span.classList.add("filter-element");
  main.append(span);
}

function clearFilter() {
  if (document.querySelector(".filter-element")) {
    document.querySelector(".filter-element").remove();
    searchPokemon("");
  }
}

async function setPokemonCards(pokemons) {
  cards.innerHTML = "";
  loading.style.display = "flex";
  backButton.style.opacity = "50%";
  if (pokemons.offset === Math.ceil(pokemons.pokemons.length / 25) - 1) {
    nextButton.style.opacity = "50%";
  }
  let pokemonPromises = [];
  for (let i = pokemons.offset * 25; i < pokemons.offset * 25 + 25; i++) {
    if (!pokemons.pokemons[i]) {
      break;
    }
    pokemonPromises.push(
      setPokemonCard(pokemons.pokemons[i].url, pokemons.pokemons[i].name)
    );
  }
  Promise.all(pokemonPromises).finally(() => {
    loading.style.display = "none";
  });
}

async function setPokemonCard(url, name) {
  return new Promise((resolve) => {
    let div = document.createElement("div");
    div.classList.add("pokemon-card");
    cards.append(div);
    getPokemonInformation(url).then((pokemonData) => {
      let pokemonName = document.createElement("span");
      let pokemonImg = document.createElement("img");
      pokemonName.textContent = getStringUpperCase(name);
      pokemonImg.src =
        pokemonData.sprites.other["official-artwork"].front_default;
      let pokemonType = setPokemonTypes(pokemonData, div);
      setOverColor(pokemonType, div);
      div.append(pokemonImg, pokemonName, pokemonType);
      resolve();
      setPanelInformation(div, pokemonData, name);
    });
  });
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
  if (
    actualPokemons.offset <
    Math.ceil(actualPokemons.pokemons.length / 25) - 1
  ) {
    actualPokemons.offset += 1;
    setPokemonCards(actualPokemons);
    backButton.style.opacity = "100%";
  }
  if (
    actualPokemons.offset ===
    Math.ceil(actualPokemons.pokemons.length / 25) - 1
  ) {
    nextButton.style.opacity = "50%";
  }
});

backButton.addEventListener("click", function () {
  if (actualPokemons.offset > 0) {
    actualPokemons.offset -= 1;
    setPokemonCards(actualPokemons);
    nextButton.style.opacity = "100%";
  }
  if (actualPokemons.offset === 0) {
    backButton.style.opacity = "50%";
  }
});

searchInput.addEventListener("keypress", function (e) {
  if (e.key == "Enter") {
    searchPokemon(searchInput.value);
  }
});

function setOverColor(pokemonTypesElement, div) {
  div.addEventListener("mouseover", function () {
    if (pokemonTypesElement.children.length === 2) {
      div.style.background = `linear-gradient(to bottom left, ${
        pokemonTypes[pokemonTypesElement.children[1].textContent.toLowerCase()]
      }, ${
        pokemonTypes[pokemonTypesElement.children[0].textContent.toLowerCase()]
      })`;
    } else {
      div.style.background =
        pokemonTypes[pokemonTypesElement.children[0].textContent.toLowerCase()];
    }
  });
  div.addEventListener("mouseleave", function () {
    div.removeAttribute("style");
  });
}

function setPanelInformation(div, pokemonData, name) {
  const panelInformation = panel.querySelector(".panel-information");
  div.addEventListener("click", function () {
    showPanel();
    panelInformation.innerHTML = `<span class="panel-name-id"></span>
          <img src="" alt="pokemon image" class="panel-img" />
          <div class="panel-types">
            <span>Types</span>
          </div>
          <div class="panel-main-info">
            <span>Height: </span>
            <span>Weight: </span>
          </div>`;
    let pokemonName = panelInformation.querySelector(".panel-name-id");
    let pokemonImg = panelInformation.querySelector(".panel-img");
    let pokemonType = setPokemonTypes(pokemonData);
    pokemonName.textContent = `${getStringUpperCase(name)} #${pokemonData.id}`;
    pokemonImg.src =
      pokemonData.sprites.other["official-artwork"].front_default;
    panel.querySelector(".panel-types").append(pokemonType);
    panel.querySelector(".panel-main-info").children[0].innerHTML +=
      pokemonData.height / 10 + "mts";
    panel.querySelector(".panel-main-info").children[1].innerHTML +=
      pokemonData.weight / 10 + "kg";
  });
}

function showPanel() {
  main.classList.add("blur");
  header.classList.add("blur");
  panelBack.style.display = "flex";
}

function hidePanel() {
  main.classList.remove("blur");
  header.classList.remove("blur");
  panelBack.style.display = "none";
}

closePanelButton.addEventListener("click", function () {
  hidePanel();
});
