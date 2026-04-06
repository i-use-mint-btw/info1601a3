import { DEADLOCK_ASSETS_API_URL } from "./constants.js";
let spirit, weapon, vitality;

async function fetchItems() {
  let response = await fetch(`${DEADLOCK_ASSETS_API_URL}/v2/items/by-slot-type/spirit`);
  spirit = await response.json();

  response = await fetch(`${DEADLOCK_ASSETS_API_URL}/v2/items/by-slot-type/vitality`);
  vitality = await response.json();

  response = await fetch(`${DEADLOCK_ASSETS_API_URL}/v2/items/by-slot-type/weapon`);
  weapon = await response.json();
  
  spirit = spirit.filter((item => item.shopable));
  vitality = vitality.filter((item => item.shopable));
  weapon = weapon.filter((item => item.shopable));

  console.log(spirit);
  console.log(vitality);
  console.log(weapon);
}
fetchItems();