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
  console.log(items);

  renderItems(itemCategoryList.value);
}
fetchItems();

itemCategoryList.addEventListener("change", () => {
  console.log("changed");
  console.log(itemCategoryList.value);
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

  currRender.every(i => {
    html += `
      <div class="item-card">
        <img src="${i.shop_image}">
        <p>${i.name}</p>
      </div>`;

    if(i.item_tier == 1) return true;
    if(i.item_tier == 2) return false;
  });

  tier1.innerHTML = html;
  html = '';

  currRender.forEach(i => {
    if(i.item_tier == 2) html += `
      <div class="item-card">
        <img src="${i.shop_image}">
        <p>${i.name}</p>
      </div>`;
  });

  tier2.innerHTML = html;
  html = '';

  currRender.forEach(i => {
    if(i.item_tier == 3) html += `
      <div class="item-card">
        <img src="${i.shop_image}">
        <p>${i.name}</p>
      </div>`;
  });

  tier3.innerHTML = html;
  html = '';

  currRender.forEach(i => {
    if(i.item_tier == 4) html += `
      <div class="item-card">
        <img src="${i.shop_image}">
        <p>${i.name}</p>
      </div>`;
  });

  tier4.innerHTML = html;
}