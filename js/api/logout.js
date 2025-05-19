document.getElementById("logout-btn")?.addEventListener("click", () => {
    if (confirm("¿Estás seguro de cerrar sesión?")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Sesión cerrada correctamente.");
        window.location.href = "/pages/login.html";
    }
});