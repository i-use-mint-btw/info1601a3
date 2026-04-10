import {
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { createUser } from "./data.js";
import { auth } from "./globals.js";

export async function register(username, email, password) {
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        await createUser(userCredentials.user.uid, username)
        window.location.href = "/pages/login.html"
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage)
    }
}

export async function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            console.log(`successfully logged in as ${email}`)
            window.location.href = "/pages/builds.html"
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage)
        });
}

export async function logout() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out', error);
    }
}
