export const state = {
    name: "",
    items: {
        spirit: [],
        vitality: [],
        weapon: []
    },
    heroes: [],
    build: {
        createdAt: Date.now(),
        userID: "",
        buildID: "",
        hero: {},
        items: {
            spirit: [],
            vitality: [],
            weapon: []
        }
    }
};