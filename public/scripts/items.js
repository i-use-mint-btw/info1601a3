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

  renderItems(itemCategoryList.value, "");
}
fetchItems();

const inputBox = document.getElementById("itemSearch");

inputBox.addEventListener("input", () => {
  renderItems(itemCategoryList.value, inputBox.value);
});


itemCategoryList.addEventListener("change", () => {
  renderItems(itemCategoryList.value, "");
  inputBox.value = '';
});

function renderItems(category, filter) {
  let currRender;
  if (category == "Spirit") currRender = items[0];
  else if (category == "Vitality") currRender = items[1];
  else currRender = items[2];

  let html = '';
  const tier1 = document.querySelector(".cards-tier-1")
  const tier2 = document.querySelector(".cards-tier-2")
  const tier3 = document.querySelector(".cards-tier-3")
  const tier4 = document.querySelector(".cards-tier-4")
  let found = [false, false, false, false];

  currRender.forEach((i, index) => {
    const name = i.name.toLowerCase();
    const search = filter.toLowerCase();
    if(i.item_tier == 1 && name.includes(search)) {
      found[0] = true;
      html += `
      <div class="item-card" onclick="showMore(${index}, '${i.item_slot_type}')">
        <img src="${i.shop_image}">
        <p>${i.name}</p>
      </div>`;
    }
  });

  if(found[0] == false) document.getElementById("t1H").style.display = "none";
  else document.getElementById("t1H").style.display = "flex";
  tier1.innerHTML = html;
  html = '';

  currRender.forEach((i, index) => {
    const name = i.name.toLowerCase();
    const search = filter.toLowerCase();
    if(i.item_tier == 2 && name.includes(search)) {
      found[1] = true;
      html += `
      <div class="item-card" onclick="showMore(${index}, '${i.item_slot_type}')">
        <img src="${i.shop_image}">
        <p>${i.name}</p>
      </div>`;
    }
  });

  if(found[1] == false) document.getElementById("t2H").style.display = "none";
  else document.getElementById("t2H").style.display = "flex";
  tier2.innerHTML = html;
  html = '';

  currRender.forEach((i, index) => {
    const name = i.name.toLowerCase();
    const search = filter.toLowerCase();
    if(i.item_tier == 3 && name.includes(search)) {
      found[2] = true;
      html += `
      <div class="item-card" onclick="showMore(${index}, '${i.item_slot_type}')">
        <img src="${i.shop_image}">
        <p>${i.name}</p>
      </div>`;
    }
  });

  if(found[2] == false) document.getElementById("t3H").style.display = "none";
  else document.getElementById("t3H").style.display = "flex";
  tier3.innerHTML = html;
  html = '';

  currRender.forEach((i, index) => {
    const name = i.name.toLowerCase();
    const search = filter.toLowerCase();
    if(i.item_tier == 4 && name.includes(search)) {
      found[3] = true;
      html += `
      <div class="item-card" onclick="showMore(${index}, '${i.item_slot_type}')">
        <img src="${i.shop_image}">
        <p>${i.name}</p>
      </div>`;
    }
  });

  if(found[3] == false) document.getElementById("t4H").style.display = "none";
  else document.getElementById("t4H").style.display = "flex";
  tier4.innerHTML = html;

  if(found[0] == false && found[1] == false && found[2] == false && found[3] == false) {
    document.getElementById("t1H").style.display = "flex";
    document.getElementById("t1H").innerHTML = "No Items Found.";
  } else document.getElementById("t1H").innerHTML = "Tier 1"
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