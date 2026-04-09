import { auth } from "./globals.js";
import { createBuild, getBuilds } from "./data.js"
import {
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

/** @type {Build} **/
const testBuild = {
    buildID: "f9j9ejh9thj9ej09jt9h9etj9ke9tg",
    createdAt: Date.now(),
    createdBy: "893y784y83797839773982",
    isPrivate: false,
    hero: { id: 1, name: "Mage" },
    items: [{ id: 101, name: "Sword" }],
}

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

document.querySelector(".create-build-btn").addEventListener("click", e => {
    async function onclick() {
        e.preventDefault()

        try {
            await createBuild()
            getBuilds(renderBuildCards)
        } catch (e) {
            //TODO: render a fallback ui if the build creation fails
            console.error("Failed to create a new build")
        }
    }

    onclick()
})

document.querySelector(".build-card").addEventListener("click", () => {
    console.log("Pressed a build card")
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
    <div class="build-card">
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