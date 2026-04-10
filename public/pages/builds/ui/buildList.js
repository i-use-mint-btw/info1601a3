export function renderBuildCards(builds) {
    const container = document.querySelector("#builds-list");

    let html = builds.map(build => `
        <div class="build-card" onclick="onBuildCardClick()">
            <h2>${build.name}</h2>
            <div class="build-items">
            <div class="hero-icon-container">
                <img class="hero-icon" src="${build.hero.photoUrl}">	
            </div>
                <div class="items-icons-container">
                    ${build.items.slice(0, 3).map(i => `<img src="${i.photoUrl}">`).join("")}
                </div>
            </div>
        </div>
    `).join("");

    html += `
        <div class="build-card create-build-btn-container" onclick="showCreateBuildModal()">
            <button class="create-build-btn">Create New Build +</button>
		</div>
    `

    container.innerHTML = html
}

window.onBuildCardClick = () => { };