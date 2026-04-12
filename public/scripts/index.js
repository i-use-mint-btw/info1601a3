import { auth } from "../../scripts/globals.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { logout } from "../../scripts/auth.js";

document.addEventListener("DOMContentLoaded", () => {
    init();
});

async function init() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
          document.getElementById("sign-out").innerHTML = "Sign Out";
          document.getElementById("sign-out").addEventListener('click', () => {
            logout();
            window.location.href = "../login/login.html";
          }) 
          return;
        } else document.getElementById("sign-out").innerHTML = "Log in / Sign Up";
    });
}