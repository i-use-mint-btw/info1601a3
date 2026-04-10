let currentBuilds = []

export function renderBuildCards(builds) {
    const container = document.querySelector("#builds-list");
    currentBuilds = builds;
    let html = `
        <div class="build-card create-build-btn-container" onclick="showCreateBuildModal()">
            <button class="create-build-btn">Create New Build +</button>
		</div>
    `

    html += builds.map((build, index) => `
        <div class="build-card" onclick="onBuildCardClick(${index})">
            <h2>${build.name}</h2>
            <div class="build-items">
            <div class="hero-icon-container">
                <img class="hero-icon" src="${build.hero.photoUrl}">	
            </div>
                <div class="items-icons-container">
                    ${build.items.slice(0, 3).map(i => `<img src="${i.photoUrl}">`).join("")}
                </div>
            </div>
        </div>`
    ).join("");

    container.innerHTML = html
}

window.onBuildCardClick = (index) => {
    highlightSelected(index+1);

    const build = currentBuilds[index];
    renderBuildPreview(build);
};

function renderBuildPreview(build) {
    const previewBox = document.querySelector(".preview-box");

    previewBox.innerHTML = `
        <h2>${build.name}</h2>

        <div class="preview-hero">
            <img class="hero-icon-large" src="${build.hero.photoUrl}">
            <h3>${build.hero.name}</h3>
        </div>

        <div class="preview-items">
            ${renderItemsByType(build.items)}
        </div>

        <div class="preview-meta">
            <p>Created: ${formatDate(build.createdAt)}</p>
        </div>
    `;
}

function renderItemsByType(items) {
    const grouped = {
        spirit: [],
        vitality: [],
        weapon: []
    };

    items.forEach(i => grouped[i.type].push(i));

    return `
        ${renderItemSection("Spirit", grouped.spirit)}
        ${renderItemSection("Vitality", grouped.vitality)}
        ${renderItemSection("Weapon", grouped.weapon)}
    `;
}

function renderItemSection(title, items) {
    if (!items.length) return "";

    return `
        <div class="item-section">
            <h4>${title}</h4>
            <div class="item-row">
                ${items.map(i => `
                    <img src="${i.photoUrl}" title="${i.name}">
                `).join("")}
            </div>
        </div>
    `;
}

function formatDate(timestamp) {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    return date.toLocaleString();
}

function highlightSelected(index) {
    document.querySelectorAll(".build-card").forEach((card, i) => {
        card.classList.toggle("active", i === index);
    });
}