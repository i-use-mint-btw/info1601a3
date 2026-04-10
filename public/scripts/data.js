import { auth, db } from "./globals.js";
import { collection, getDoc, addDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const buildCol = collection(db, "builds")

export async function getBuilds(renderFun) {
    const buildSnapshot = await getDocs(buildCol);
    const buildList = buildSnapshot.docs.map(doc => doc.data())
    renderFun(buildList, await getUsername())
}

/** @param {Build} build **/
export async function createBuild(build) {
    try {
        await addDoc(buildCol, build);
    } catch (e) {
        console.error("Error when trying to create build: ", e);
    }
}

/** @returns {Promise<boolean>} **/
export async function deleteBuild(auth, buildID) {
    const buildDoc = await getDoc(buildCol);

    if (buildDoc.exists() && buildDoc.data().userID === auth.currentUser.uid) {
        await deleteDoc(buildDoc);
        console.log("Build deleted successfully");
        return true;
    } else {
        console.log("Build not found or you don't have permission to delete it");
        return false;
    }
}

export async function createUser(id, username) {
    try {
        await addDoc(collection(db, "users"), { id, username })
    } catch (e) {
        console.error('Failed to create user', e)
    }
}

export async function getUsername() {
    try {
        const userSnapshot = await getDocs(collection(db, "users"))
        const user = userSnapshot.docs.find(doc => doc.data().id === auth.currentUser.uid)
        return user.data().username
    } catch (e) {
        console.error('Failed to get username', e)
    }
}

// The following is exactly why typescript is my goat

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
 * @property {string} name
 * @property {number|string} createdBy
 * @property {number|string} buildID
 * @property {Hero} hero
 * @property {Item[]} items
 * @property {Date} createdAt
 * @property {boolean} isPrivate
 */