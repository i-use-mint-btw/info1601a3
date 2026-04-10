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

async function fetchHeroData() {
    let response = await fetch(`${DEADLOCK_ASSETS_API_URL}/v2/heroes`);
    const heroes = await response.json();
    displayHeroCarousel(heroes);
}

function displayHeroCarousel(heroes) {
    let html
    heroes.forEach(h => {
        html += `
        <div>
            <img class="hero-carousel-img" src="${h.images.top_bar_vertical_image}" 
            style="border-color: rgb(255, 255, 255);
            border-width: 1px;
            background-image: url("${h.images.background_image_webp}");">
        </div>`
    })

    document.querySelector(".glider").innerHTML = html
}

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