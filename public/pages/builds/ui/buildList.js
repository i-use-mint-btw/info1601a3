export function renderBuildCards(builds) {
    const container = document.querySelector("#builds-list");

    container.innerHTML += builds.map(build => `
        <div class="build-card" onclick="onBuildCardClick()">
            <h2>${build.name}</h2>
            <div class="build-items">
                <img class="hero-icon" src="${build.hero.photoUrl}">
                ${build.items.slice(0,3).map(i => `<img src="${i.photoUrl}">`).join("")}
            </div>
        </div>
    `).join("");
}

window.onBuildCardClick = () => {};