export function initModal(fetchHeroesAndInit) {
    const modal = document.getElementById("modal-form");

    window.showCreateBuildModal = async () => {
        modal.classList.add("show-modal");
        modal.classList.remove("hide-modal");

        await fetchHeroesAndInit();
    };

    window.hideCreateBuildModal = () => {
        modal.classList.add("hide-modal");
        modal.classList.remove("show-modal");
    };

    document.getElementById("close")
        .addEventListener("click", e => e.preventDefault());
}