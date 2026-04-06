import { DEADLOCK_ASSETS_API_URL } from "./constants.js";
let heroes = [];

async function fetchHeroData() {
  let response = await fetch(`${DEADLOCK_ASSETS_API_URL}/v2/heroes`);
  heroes = await response.json();
  
  displayHeroes(heroes, ""); 
}

function displayHeroes(heroes, filter) {
  const insertCards = document.querySelector(".cards");
  let html = "";

  //add in paragraph if you'd like <p style="color: rgba(255, 255, 255, 0.7); margin-top: 10px">${h.name}</p>

  heroes.forEach(h => {
    h.name = h.name.toLowerCase();
    filter = filter.toLowerCase();

    if(!h.in_development && h.name != "kali" && h.name.includes(filter)) {
      html += `
      <div>
        <img src="${h.images.top_bar_vertical_image}" 
        style="border-color: rgb(255, 255, 255);
        border-width: 1px;
        background-image: url("${h.images.background_image_webp}");">
      </div>
      `
    }
  });

  insertCards.innerHTML = html;
}

const inputBox = document.getElementById("heroSearch");

inputBox.addEventListener("input", () => {
  console.log(inputBox.value);
  displayHeroes(heroes, inputBox.value);
});

fetchHeroData();