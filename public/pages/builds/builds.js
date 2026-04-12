import { auth } from "../../scripts/globals.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getBuilds } from "../../scripts/data.js";
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js"
import { createBuild } from "../../scripts/data.js";
import { state } from "./state.js";
import { fetchAllItems, fetchHeroes } from "./api.js";
import { renderBuildCards } from "./ui/buildList.js";
import { initModal } from "./ui/modal.js";
import { createDropdown } from "./ui/dropdown.js";
import { logout } from "../../scripts/auth.js";

document.addEventListener("DOMContentLoaded", () => {
    init();
    document.getElementById("sign-out").addEventListener('click', () => {
        logout();
        window.location.href = "../login/login.html";
    })
});

async function init() {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            alert("Login required");
            window.location.href = "../login/login.html";
            return;
        }

        state.items = await fetchAllItems();

        getBuilds(renderBuildCards, user.uid);
        initModal(initHeroDropdown);
        initItemDropdowns();
    });
}

async function initHeroDropdown() {
    state.heroes = await fetchHeroes();

    const searchBox = document.getElementById("searchBox");
    const dropdown = document.getElementById("dropdownList");

    createDropdown({
        searchInput: searchBox,
        dropdownElement: dropdown,
        data: state.heroes,
        display: h => `
            <img src="${h.images.top_bar_vertical_image}" width="24">
            <span>${h.name}</span>
        `,
        onSelect: (name) => {
            const hero = state.heroes.find(h => h.name === name);
            state.build.hero = hero;
            searchBox.value = name;
            dropdown.style.display = "none";
        }
    });
}

function initItemDropdowns() {
    setupItemDropdown("spirit");
    setupItemDropdown("vitality");
    setupItemDropdown("weapon");
}

function setupItemDropdown(type) {
    const searchBox = document.getElementById(`${type}SearchBox`);
    const dropdown = document.getElementById(`${type}DropdownList`);

    createDropdown({
        searchInput: searchBox,
        dropdownElement: dropdown,
        data: state.items[type],
        display: i => `
            <img src="${i.shop_image}" width="24">
            <span>${i.name}</span>
        `,
        onSelect: (name) => {
            const item = state.items[type].find(i => i.name === name);

            state.build.items[type].push({
                uid: item.id,
                name: item.name,
                shop_image: item.shop_image
            });

            updateList(type);
            dropdown.style.display = "none";
            searchBox.value = name;
        }
    });
}

function updateList(type) {
    const ul = document.getElementById(`${type}UnorderedList`);

    ul.innerHTML = state.build.items[type].map(i => `
        <li class="slot" onclick="deleteItem(${i.uid}, '${type}')">
            <img src="${i.shop_image}">
            <p>${i.name}</p>
        </li>
    `).join("");
}

window.deleteItem = (uid, type) => {
    state.build.items[type] =
        state.build.items[type].filter(i => i.uid !== uid);

    updateList(type);
};

function assembleBuild(user) {
    const nameInput = document.getElementById("buildName");

    if (!nameInput.value.trim()) {
        alert("Build must have a name");
        return null;
    }

    if (!state.build.hero.id) {
        alert("Please select a hero");
        return null;
    }

    const flattenedItems = [
        ...state.build.items.spirit.map(i => ({
            id: i.uid,
            type: "spirit",
            photoUrl: i.shop_image
        })),
        ...state.build.items.vitality.map(i => ({
            id: i.uid,
            type: "vitality",
            photoUrl: i.shop_image
        })),
        ...state.build.items.weapon.map(i => ({
            id: i.uid,
            type: "weapon",
            photoUrl: i.shop_image
        })),
    ];

    return {
        name: nameInput.value.trim(),
        createdBy: user.uid,
        hero: {
            id: state.build.hero.id,
            name: state.build.hero.name,
            photoUrl: state.build.hero.images?.top_bar_vertical_image // 👈 key line
        },
        items: flattenedItems,
        createdAt: Date.now(),
        isPrivate: false
    };
}

document.getElementById("save-build").addEventListener("click", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) return

    const build = assembleBuild(user);

    if (!build) { console.log(build); return };

    try {
        await createBuild(build);

        console.log("Build saved:", build);

        location.reload()

    } catch (err) {
        console.error(err);
        alert("Failed to save build");
    }
});

document.getElementById("close").addEventListener("click", resetForm)

function resetForm() {
    document.getElementById("buildName").value = "";

    state.build = {
        createdAt: Date.now(),
        userID: "",
        buildID: "",
        hero: {},
        items: {
            spirit: [],
            vitality: [],
            weapon: []
        }
    };

    ["spirit", "vitality", "weapon"].forEach(updateList);
}