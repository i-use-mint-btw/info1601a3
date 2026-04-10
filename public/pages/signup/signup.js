import { register } from "../../scripts/auth.js";

document.getElementById("signupButton").addEventListener("click", (e) => {
    // TODO: validate email and password with regex or something
    e.preventDefault()

    const usernameInput = document.getElementById("usernameInput")
    const emailInput = document.getElementById("emailInput")
    const passwordInput = document.getElementById("passwordInput")

    register(usernameInput.value, emailInput.value, passwordInput.value)
        .catch(e, () => {
            console.error(`Failed to login user: ${usernameInput.value}`)
            console.error(`Error: ${error.code}, message: ${error.message}`)
        })
});