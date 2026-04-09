import { DEADLOCK_ASSETS_API_URL } from "./constants.js";
let spirit, weapon, vitality, items;
const itemCategoryList = document.getElementById("item-Category");

async function fetchItems() {
  let response = await fetch(`${DEADLOCK_ASSETS_API_URL}/v2/items/by-slot-type/spirit`);
  spirit = await response.json();

  response = await fetch(`${DEADLOCK_ASSETS_API_URL}/v2/items/by-slot-type/vitality`);
  vitality = await response.json();

  response = await fetch(`${DEADLOCK_ASSETS_API_URL}/v2/items/by-slot-type/weapon`);
  weapon = await response.json();
  
  spirit = spirit.filter((item => item.shopable));
  spirit.sort((a, b) => a.item_tier - b.item_tier);
  vitality = vitality.filter((item => item.shopable));
  vitality.sort((a, b) => a.item_tier - b.item_tier);
  weapon = weapon.filter((item => item.shopable));
  weapon.sort((a, b) => a.item_tier - b.item_tier);

  items = [spirit, vitality, weapon]

  renderItems(itemCategoryList.value);
}
fetchItems();

itemCategoryList.addEventListener("change", () => {
  renderItems(itemCategoryList.value);
});

function renderItems(category) {
  let currRender;
  if (category == "Spirit") currRender = items[0];
  else if (category == "Vitality") currRender = items[1];
  else currRender = items[2];

  let html = '';
  const tier1 = document.querySelector(".cards-tier-1")
  const tier2 = document.querySelector(".cards-tier-2")
  const tier3 = document.querySelector(".cards-tier-3")
  const tier4 = document.querySelector(".cards-tier-4")

  currRender.every((i, index) => {
    html += `
      <div class="item-card" onclick="showMore(${index}, '${i.item_slot_type}')">
        <img src="${i.shop_image}">
        <p>${i.name}</p>
      </div>`;

    if(i.item_tier == 1) return true;
    if(i.item_tier == 2) return false;
  });

  tier1.innerHTML = html;
  html = '';

  currRender.forEach((i, index) => {
    if(i.item_tier == 2) html += `
      <div class="item-card" onclick="showMore(${index}, '${i.item_slot_type}')">
        <img src="${i.shop_image}">
        <p>${i.name}</p>
      </div>`;
  });

  tier2.innerHTML = html;
  html = '';

  currRender.forEach((i, index) => {
    if(i.item_tier == 3) html += `
      <div class="item-card" onclick="showMore(${index}, '${i.item_slot_type}')">
        <img src="${i.shop_image}">
        <p>${i.name}</p>
      </div>`;
  });

  tier3.innerHTML = html;
  html = '';

  currRender.forEach((i, index) => {
    if(i.item_tier == 4) html += `
      <div class="item-card" onclick="showMore(${index}, '${i.item_slot_type}')">
        <img src="${i.shop_image}">
        <p>${i.name}</p>
      </div>`;
  });

  tier4.innerHTML = html;
}

//Modal Content
window.showMore = function(index, slotType) {
  let itemDetails;
  if (slotType == "spirit") itemDetails = items[0];
  else if (slotType == "vitality") itemDetails = items[1];
  else itemDetails = items[2];

  const modalContent = document.querySelector(".modal-content");
  const modal = document.getElementById("modal");
  modal.style.display = "block";

  if(itemDetails[index].description.desc == undefined) {
    modalContent.innerHTML = `
      <h1>${itemDetails[index].name}</h1>
      <div style="display: flex; flex-direction: row; margin-bottom: 20px">
        <img src="${itemDetails[index].shop_image}" style="height:100%; margin-right: 20px;">
        <div>
        <p>Price: ${itemDetails[index].cost}<img style="width: 1em; height: auto; vertical-align: middle; border:none;" src="https://deadlockrank.com/wp-content/sites/deadlock/2025/01/deadlock-soul-icon.png"></p>
        <p>Item Tier: ${itemDetails[index].item_tier}</p>
        </div>
      </div>
      <span class="close">&times;</span>
    `;
  }

  else {
    modalContent.innerHTML = `
      <h1 style="font-size: 3rem;">${itemDetails[index].name}</h1>
      <div style="display: flex; flex-direction: row; margin-bottom: 20px">
        <img src="${itemDetails[index].shop_image}" style="height:100%; margin-right: 20px;">
        <div>
        <p>Price: ${itemDetails[index].cost}<img style="width: 1em; height: auto; vertical-align: middle; border:none;" src="https://deadlockrank.com/wp-content/sites/deadlock/2025/01/deadlock-soul-icon.png"></p>
        <p>Item Tier: ${itemDetails[index].item_tier}</p>
        </div>
      </div>
      <p style="text-align: center">${itemDetails[index].description.desc}</p>
      <span class="close">&times;</span>
    `;
    }
  const span = document.querySelector(".close");
  span.onclick = () => {
    modal.style.display = "none";
  };
}



window.onclick = function(event) {
  if(event.target == modal) {
    modal.style.display = "none";
  }
}