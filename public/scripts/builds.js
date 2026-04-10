import { auth } from "./globals.js";
import { createBuild, getBuilds } from "./data.js"
import {
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { DEADLOCK_ASSETS_API_URL } from "./constants.js";

// /** @type {Build} **/
// const testBuild = {
//     buildID: "f9j9ejh9thj9ej09jt9h9etj9ke9tg",
//     createdAt: Date.now(),
//     createdBy: "893y784y83797839773982",
//     isPrivate: false,
//     hero: { id: 1, name: "Mage" },
//     items: [{ id: 101, name: "Sword" }],
// }

window.addEventListener('DOMContentLoaded', () => {
    async function onload() {
        //createBuild(testBuild)

        if (auth.currentUser != null) {
            getBuilds(renderBuildCards)
            return
        }

        alert("only users who are logged in can see this page.")
        window.location.href = "/pages/login.html"
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

const createBuildModal = document.getElementById("modal-form")

window.showCreateBuildModal = () => {
    createBuildModal.classList.add("show-modal")
    createBuildModal.classList.remove("hide-modal")
    fetchHeroData()
}

window.hideCreateBuildModal = () => {
    createBuildModal.classList.add("hide-modal")
    createBuildModal.classList.remove("show-modal")
}

let heroes; 
async function fetchHeroData() {
    let response = await fetch(`${DEADLOCK_ASSETS_API_URL}/v2/heroes`);
    heroes = await response.json();
    heroes = heroes.filter(hero => !hero.in_development && hero.name != "kali");
    renderList(heroes);
}

window.filterItems = function () {
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

window.selectHero = function(name) {
  searchBox.value = name;
  let heroData = heroes.filter(hero => hero.name == name);
  dropdown.style.display = "none";

  console.log("Selected Hero ID", heroData[0].id);
  console.log("Selected hero:", name); //attach to build
};

let dropdown = document.getElementById("dropdownList");
let searchBox = document.getElementById("searchBox");

searchBox.addEventListener("input", filterItems);

searchBox.addEventListener("focus", () => {
  if (heroes.length) renderList(heroes);
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