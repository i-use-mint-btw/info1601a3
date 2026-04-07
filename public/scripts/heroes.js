import { DEADLOCK_ASSETS_API_URL } from "./constants.js";
let heroes = [];

async function fetchHeroData() {
  let response = await fetch(`${DEADLOCK_ASSETS_API_URL}/v2/heroes`);
  heroes = await response.json();
  displayHeroes(heroes, ""); 
}

window.showMore = function(index) {
  const modalContent = document.querySelector(".modal-content");
  const modal = document.getElementById("modal");
  modal.style.display = "block";

  if(heroes[index].description.role == undefined || heroes[index].description.playstyle == undefined) {
    modalContent.innerHTML = `
    <h1 style="font-size: 3rem;">${heroes[index].name}</h1>
      <div style="display: flex; flex-direction: row; justify-items: flex-start; align-items: flex-start; margin: 0px; margin-top: 15px;">
          <p style="padding-right: 5%; font-size: 1.2rem;">${heroes[index].description.lore}</p>
          <img src="${heroes[index].images.top_bar_vertical_image}" style="height:100%; margin-right: 20px;">
      </div>
    `;
  }
  
  else {
  modalContent.innerHTML = `
   <h1 style="font-size: 3rem;">${heroes[index].name}</h1>
   <p>${heroes[index].description.role}</p>
   <p>${heroes[index].description.playstyle}</p>
    <div style="display: flex; flex-direction: row; justify-items: flex-start; align-items: flex-start; margin: 0px; margin-top: 15px;">
        <p style="padding-right: 5%; font-size: 1.2rem;">${heroes[index].description.lore}</p>
        <img src="${heroes[index].images.top_bar_vertical_image}" style="height:100%; margin-right: 20px;">
    </div>
  `;
  }
}

window.onclick = function(event) {
  if(event.target == modal) {
    modal.style.display = "none";
  }
}

function displayHeroes(heroes, filter) {
  const insertCards = document.querySelector(".cards");
  let html = "";

  //add in paragraph if you'd like <p style="color: rgba(255, 255, 255, 0.7); margin-top: 10px">${h.name}</p>

  heroes.forEach((h, index) => {
    const name = h.name.toLowerCase();
    const search = filter.toLowerCase();

  if (!h.in_development && name != "kali" && name.includes(search) && h.player_selectable) {
      html += `
      <div onclick="showMore(${index})">
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
  //console.log(inputBox.value);
  displayHeroes(heroes, inputBox.value);
});

fetchHeroData();