import {
    signOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { user, auth, setUser } from "./globals.js"

onAuthStateChanged(auth, u => {
    if (u) {
        setUser(u)
    } else {
        //onLogout();
    }
});

async function register(email, password) {
    try {
        const credentials = createUserWithEmailAndPassword(auth, email, password)
    } catch (e) {
        console.error(e);
    }
}

export async function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(`successfully signed in as ${email}`)
            const user = userCredential.user;
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

function isLoggedIn() {
    if (!user) return false
    return true
}