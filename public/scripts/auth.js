import {
    signOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { user, auth, setUser } from "./globals.js"

onAuthStateChanged(auth, u => {
    if (u) {
        setUser(u)
    } else {
        //onLogout();
    }
});

export async function register(username, email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then(() => console.log(`successfully registered as ${email}`))
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage)
        });
}

export async function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then(() => console.log(`successfully logged in as ${email}`))
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

function isLoggedIn() {
    if (!user) return false
    return true
}