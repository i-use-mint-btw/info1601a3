import { DEADLOCK_ASSETS_API_URL } from "../../scripts/constants.js";

export async function fetchAllItems() {
    const types = ["spirit", "vitality", "weapon"];

    const results = await Promise.all(
        types.map(type =>
            fetch(`${DEADLOCK_ASSETS_API_URL}/v2/items/by-slot-type/${type}`)
                .then(res => res.json())
        )
    );

    return {
        spirit: cleanItems(results[0]),
        vitality: cleanItems(results[1]),
        weapon: cleanItems(results[2]),
    };
}

function cleanItems(items) {
    return items
        .filter(i => i.shopable)
        .sort((a, b) => a.item_tier - b.item_tier);
}

export async function fetchHeroes() {
    const res = await fetch(`${DEADLOCK_ASSETS_API_URL}/v2/heroes`);
    let heroes = await res.json();

    return heroes.filter(h => !h.in_development && h.name !== "kali");
}