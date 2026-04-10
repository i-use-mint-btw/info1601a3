import { auth } from "../../scripts/globals.js";
import { createBuild, getBuilds } from "../../scripts/data.js"
import {
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { DEADLOCK_ASSETS_API_URL } from "../../scripts/constants.js";

// /** @type {Build} **/
// const testBuild = {
//     buildID: "f9j9ejh9thj9ej09jt9h9etj9ke9tg",
//     createdAt: Date.now(),
//     createdBy: "893y784y83797839773982",
//     isPrivate: false,
//     hero: { id: 1, name: "Mage" },
//     items: [{ id: 101, name: "Sword" }],
// }

//fetches Items
let items;
async function fetchItems() {
  let response = await fetch(`${DEADLOCK_ASSETS_API_URL}/v2/items/by-slot-type/spirit`);
  let spirit = await response.json();

  response = await fetch(`${DEADLOCK_ASSETS_API_URL}/v2/items/by-slot-type/vitality`);
  let vitality = await response.json();

  response = await fetch(`${DEADLOCK_ASSETS_API_URL}/v2/items/by-slot-type/weapon`);
  let weapon = await response.json();
  
  spirit = spirit.filter((item => item.shopable));
  spirit.sort((a, b) => a.item_tier - b.item_tier);
  vitality = vitality.filter((item => item.shopable));
  vitality.sort((a, b) => a.item_tier - b.item_tier);
  weapon = weapon.filter((item => item.shopable));
  weapon.sort((a, b) => a.item_tier - b.item_tier);

  items = [spirit, vitality, weapon];
  console.log(items);
}

fetchItems();

//Name is unnecessary but would be useful for figuring out bugs
let buildData = {
    createdAt: Date.now(),
    userID: "given from userData",
    buildID: "",
    hero: {},
    items: {
        spirit: [], 
        vitality: [],
        weapon: []
    }
}

window.addEventListener('DOMContentLoaded', () => {
    async function onload() {
        //createBuild(testBuild)

        if (auth.currentUser != null) {
            getBuilds(renderBuildCards)
            return
        }

        alert("only users who are logged in can see this page.")
        window.location.href = '../pages/login.html'
    }

    onAuthStateChanged(auth, onload)
})

document.getElementById("close").addEventListener("click", e => e.preventDefault())

document.getElementById("save-build").addEventListener("click", e => {
    e.preventDefault()
    console.log("Build saved")
})


/** @param {Build[]} builds **/
async function renderBuildCards(builds, username) {
    const buildsListContainer = document.querySelector("#builds-list")
    builds.map(build => {
        buildsListContainer.innerHTML += createBuildCard(build)
    })
}

/** @param {Build} build **/
function createBuildCard(build) {
    return `
    <div class="build-card" onclick="onBuildCardClick()">
        <div>
            <h2>${build.name}</h2>
        </div>
        <div class="build-items">
            <div class="hero-icon-container">
                <img class="hero-icon" src=${build.hero.photoUrl}>
            </div>
            <div class="items-icons-container">
                ${createItemPreviewList(build.items)}
            </div>
        </div>
    </div>`
}

/** @param {Item[]} items **/
function createItemPreviewList(items) {
    let str = ""

    items.forEach((item, i) => {
        if (i === 3) return
        str += `<img src="${item.photoUrl}">`
    })

    return str
}

window.onBuildCardClick = () => {
    // Render that entire build here
}

//For the modal
const createBuildModal = document.getElementById("modal-form")

//Opens the "Create Build" modal and loads hero data for the dropdown selector.
window.showCreateBuildModal = () => {
    createBuildModal.classList.add("show-modal")
    createBuildModal.classList.remove("hide-modal")
    fetchHeroData()
}

//Closes the "Create Build" modal and resets visibility state.
window.hideCreateBuildModal = () => {
    createBuildModal.classList.add("hide-modal")
    createBuildModal.classList.remove("show-modal")
}

//fetch hero data
let heroes; 
async function fetchHeroData() {
    let response = await fetch(`${DEADLOCK_ASSETS_API_URL}/v2/heroes`);
    heroes = await response.json();
    heroes = heroes.filter(hero => !hero.in_development && hero.name != "kali");
    renderList(heroes);
}

//Filters heroes further
window.filterHeroes = function () {
  if (!heroes.length) return;

  const value = searchBox.value.toLowerCase();

  const filtered = heroes.filter(h =>
    h.name.toLowerCase().includes(value) && h.name != "Kali"
  );

  renderList(filtered);
};

document.addEventListener("click", (e) => {
  const modal = document.getElementById("modal-form");
  const dropdownBox = document.querySelector(".dropdown");

  if (e.target === modal) {
    createBuildModal.classList.add("hide-modal")
    createBuildModal.classList.remove("show-modal")
  }

  if (dropdownBox && !dropdownBox.contains(e.target)) {
    dropdown.style.display = "none";
  }
});

//Renders hero dropdown list UI
function renderList(list) {
  let html = "";

  list.forEach(h => {
    html += `
      <div class="dropdown-item" data-name="${h.name}">
        <img 
          class="hero-carousel-img" 
          src="${h.images.top_bar_vertical_image}"
          style="width: 1.5em; height: auto; border: none"
        >
        <span>${h.name}</span>
      </div>
    `;
  });

  dropdown.innerHTML = html;
  dropdown.style.display = list.length ? "block" : "none";

  document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", () => {
      if(item.dataset.name.toLowerCase() !== "kali")
        selectHero(item.dataset.name);
    });
  });
}

// Handles selecting a hero from dropdown. Updates input field and stores hero data in build state.
window.selectHero = function(name) {
  searchBox.value = name;
  let heroData = heroes.filter(hero => hero.name == name);
  dropdown.style.display = "none";
  
  buildData.hero.heroID = heroData[0].id;
  buildData.hero.name = heroData[0].name;
  console.log(buildData);
};

let dropdown = document.getElementById("dropdownList");
let searchBox = document.getElementById("searchBox");

searchBox.addEventListener("input", filterHeroes);

searchBox.addEventListener("focus", () => {
  if (heroes.length) renderList(heroes);
});

//Start Rendering and fetching spirit data here
let spiritItems;
await fetchItems().then(() => {
    spiritItems = items[0];
});

let spiritDropdown = document.getElementById("spiritDropdownList");
let spiritSearchBox = document.getElementById("spiritSearchBox");

window.filterSpiritItems = function () {
    if (!Array.isArray(spiritItems)) return;

    const value = spiritSearchBox.value.toLowerCase();

    const filtered = spiritItems.filter(i =>
        i.name.toLowerCase().includes(value)
    );

    renderSpiritList(filtered);
};

function renderSpiritList(list) {
    let html = "";

    list.forEach(i => {
    html += `
        <div class="dropdown-item" data-name="${i.name}">
        <img class="hero-carousel-img" src="${i.shop_image}">
        <span>${i.name}</span>
        </div>
    `;
    });

    spiritDropdown.innerHTML = html;
    spiritDropdown.style.display = list.length ? "block" : "none";

    spiritDropdown.querySelectorAll(".dropdown-item").forEach(item => {
        item.onclick = () => {
            selectSpirit(item.dataset.name);
        };
    });
}

window.deleteItem = function(itemUID, type) {
    const toDelete = document.getElementById(itemUID);

    if (!toDelete) return;

    buildData.items[type] = buildData.items[type].filter(
        item => item.uid != itemUID
    );

    console.log(buildData);

    toDelete.remove();
};

function updateUnorderedList(currItems, itemType) {
    const type = document.getElementById(`${itemType}UnorderedList`);
    let html = '';

    console.log(currItems);

    currItems.forEach(i => {
        html += `<li onclick="deleteItem(${i.uid}, '${itemType}')" id="${i.uid}" class="dropdown-item"><img src="${i.shop_image}"><p>${i.name}</p></li>`
    });

    type.innerHTML = html;
}

window.selectSpirit = function (name) {
    spiritSearchBox.value = name;

    let itemData = spiritItems.find(i => i.name === name);

    spiritDropdown.style.display = "none";

    buildData.items.spirit.push({
        uid: itemData.id,
        shop_image: itemData.shop_image,
        name: itemData.name
    });

    console.log(buildData);
    updateUnorderedList(buildData.items.spirit, "spirit");
};

spiritSearchBox.addEventListener("input", window.filterSpiritItems);

spiritSearchBox.addEventListener("focus", () => {
    if (Array.isArray(spiritItems) && spiritItems.length) {
    renderSpiritList(spiritItems);
    }
});

//Start Rendering and fetching vitality data here
let vitalityItems;
await fetchItems().then(() => {
    vitalityItems = items[1];
});

let vitalityDropdown = document.getElementById("vitalityDropdownList");
let vitalitySearchBox = document.getElementById("vitalitySearchBox");

window.filterVitalityItems = function () {
    if (!Array.isArray(vitalityItems)) return;

    const value = vitalitySearchBox.value.toLowerCase();

    const filtered = vitalityItems.filter(i =>
        i.name.toLowerCase().includes(value)
    );

    renderVitalityList(filtered);
};

function renderVitalityList(list) {
    let html = "";

    list.forEach(i => {
    html += `
        <div class="dropdown-item" data-name="${i.name}">
        <img class="hero-carousel-img" src="${i.shop_image}">
        <span>${i.name}</span>
        </div>
    `;
    });

    vitalityDropdown.innerHTML = html;
    vitalityDropdown.style.display = list.length ? "block" : "none";

    vitalityDropdown.querySelectorAll(".dropdown-item").forEach(item => {
        item.onclick = () => {
            selectVitality(item.dataset.name);
        };
    });
}

window.selectVitality = function (name) {
    vitalitySearchBox.value = name;

    let itemData = vitalityItems.find(i => i.name === name);

    vitalityDropdown.style.display = "none";

    buildData.items.vitality.push({
        uid: itemData.id,
        shop_image: itemData.shop_image,
        name: itemData.name
    });

    console.log(buildData);
    updateUnorderedList(buildData.items.vitality, "vitality");
};

vitalitySearchBox.addEventListener("input", window.filterVitalityItems);

vitalitySearchBox.addEventListener("focus", () => {
    if (Array.isArray(vitalityItems) && vitalityItems.length) {
    renderVitalityList(vitalityItems);
    }
});

//Start Rendering and fetching weapon data here
let weaponItems;
await fetchItems().then(() => {
    weaponItems = items[2];
});

let weaponDropdown = document.getElementById("weaponDropdownList");
let weaponSearchBox = document.getElementById("weaponSearchBox");

window.filterWeaponItems = function () {
    if (!Array.isArray(weaponItems)) return;

    const value = weaponSearchBox.value.toLowerCase();

    const filtered = weaponItems.filter(i =>
        i.name.toLowerCase().includes(value)
    );

    renderWeaponList(filtered);
};

function renderWeaponList(list) {
    let html = "";

    list.forEach(i => {
    html += `
        <div class="dropdown-item" data-name="${i.name}">
        <img class="hero-carousel-img" src="${i.shop_image}">
        <span>${i.name}</span>
        </div>
    `;
    });

    weaponDropdown.innerHTML = html;
    weaponDropdown.style.display = list.length ? "block" : "none";

    weaponDropdown.querySelectorAll(".dropdown-item").forEach(item => {
        item.onclick = () => {
            selectWeapon(item.dataset.name);
        };
    });
}

window.selectWeapon = function (name) {
    weaponSearchBox.value = name;

    let itemData = weaponItems.find(i => i.name === name);

    weaponDropdown.style.display = "none";

    buildData.items.weapon.push({
        uid: itemData.id,
        shop_image: itemData.shop_image,
        name: itemData.name
    });

    console.log(buildData);
    updateUnorderedList(buildData.items.weapon, "weapon");
};

weaponSearchBox.addEventListener("input", window.filterWeaponItems);

weaponSearchBox.addEventListener("focus", () => {
    if (Array.isArray(weaponItems) && weaponItems.length) {
    renderWeaponList(weaponItems);
    }
});

/**
 * @typedef {Object} Hero
 * @property {number|string} id
 * @property {string} name
 * @property {string} photoUrl
 */

/**
 * @typedef {Object} Item
 * @property {number|string} id
 * @property {string} name
 * @property {string} photoUrl
 */

/**
 * @typedef {Object} Build
 * @property {string} name
 * @property {number|string} createdBy
 * @property {number|string} buildID
 * @property {Hero} hero
 * @property {Item[]} items
 * @property {Date} createdAt
 * @property {boolean} isPrivate
 */