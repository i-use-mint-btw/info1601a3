import { auth } from "./globals.js";
import { getBuilds } from "./data.js"
import {
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

window.addEventListener('DOMContentLoaded', () => {
    async function onload() {
        if (auth.currentUser != null) {
            getBuilds(renderBuilds)
            return
        }

        alert("only users who are logged in can see this page.")
        window.location.href = "/pages/login.html"
    }

    onAuthStateChanged(auth, onload)
})


/** @param {Build[]} builds **/
async function renderBuilds(builds, username) {
    const buildsContainer = document.querySelector(".builds-container")
    buildsContainer.innerHTML += `Welcome back ${username}`
    console.log(builds)
}





/**
 * @typedef {Object} Hero
 * @property {number|string} id
 * @property {string} name
 */

/**
 * @typedef {Object} Item
 * @property {number|string} id
 * @property {string} name
 */

/**
 * @typedef {Object} Build
 * @property {number|string} createdBy
 * @property {number|string} buildID
 * @property {Hero} hero
 * @property {Item[]} items
 * @property {Date} createdAt
 * @property {boolean} isPrivate
 */