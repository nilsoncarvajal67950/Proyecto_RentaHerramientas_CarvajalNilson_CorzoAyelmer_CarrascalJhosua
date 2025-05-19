import { API_URL } from "./enviroment.js";

// Login
document
    .getElementById("login-form")
    ?.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        if (!username || !password) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) throw new Error("Credenciales inválidas");
            console.log("Se logueo exitosamente");

            const data = await response.json();
            const token = data.token;
            const userRole = data.role;
            console.log("Este es el token: " + token);
            console.log("Este es el rol del usuario: " + userRole);

            localStorage.setItem("token", token);
            localStorage.setItem("userRole", userRole);
            localStorage.setItem("username", username);

            setTimeout(() => {
                window.location.href = "../index.html";
            }, 5000);
        } catch (error) {
            console.log(error.message);
            alert("Error en el login: " + error.message);
        }
    });

// Registro
document
    .getElementById("register-form")
    ?.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const name = document.getElementById("name").value.trim();
        const addres = document.getElementById("address").value;
        const phone = document.getElementById("phone").value;

        if (!name || !email || !password) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Por favor, introduce un correo electrónico válido.");
            return;
        }

        if (password.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registro exitoso. ¡Ahora inicia sesión!");
                window.location.href = "/pages/login.html";
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error al registrarte:", error);
            alert("Ocurrió un problema al registrarte.");
        }
    });
