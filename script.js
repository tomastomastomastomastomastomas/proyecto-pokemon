const defaultUrl = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=25";
const cards = document.querySelector(".cards-container");

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

  div.append(pokemonImg);
  div.append(pokemonName);
}

function getStringUpperCase(string) {
  let newString = string[0].toUpperCase();
  for (let i = 1; i < string.length; i++) {
    newString += string[i].toLowerCase();
  }
  return newString;
}
