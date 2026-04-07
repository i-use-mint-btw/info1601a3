import { login } from "./auth.js";
import { user, auth } from "./globals.js";

document.getElementById("loginButton").addEventListener("click", (e) => {
    // TODO: validate email and password with regex or something
    e.preventDefault()

    const emailInput = document.getElementById("emailInput")
    const passwordInput = document.getElementById("passwordInput")

    login(emailInput.value, passwordInput.value)
        .then(() => {
            user = auth.currentUser
        })
        .catch(e, () => {
            console.error(`Failed to login user: ${emailInput.value}`)
            console.error(`Error: ${error.code}, message: ${error.message}`)
        })
});