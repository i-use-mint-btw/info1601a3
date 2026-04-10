export function createDropdown({
    searchInput,
    dropdownElement,
    data,
    onSelect,
    display
}) {
    function render(list) {
        dropdownElement.innerHTML = list.map(item => `
            <div class="dropdown-item" data-name="${item.name}">
                ${display(item)}
            </div>
        `).join("");

        dropdownElement.style.display = list.length ? "block" : "none";

        dropdownElement.querySelectorAll(".dropdown-item").forEach(el => {
            el.onclick = () => onSelect(el.dataset.name);
        });
    }

    function filter() {
        const value = searchInput.value.toLowerCase();

        const filtered = data.filter(d =>
            d.name.toLowerCase().includes(value)
        );

        render(filtered);
    }

    searchInput.addEventListener("input", filter);

    searchInput.addEventListener("focus", () => {
        render(data);
    });

    return { render };
}