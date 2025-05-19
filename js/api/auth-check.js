document.addEventListener("DOMContentLoaded", () => {
    const protectedPaths = [
        "/pages/admin/",
        "/pages/provider/",
        "/pages/client/"
    ];

    const currentPath = window.location.pathname;

    const isProtected = protectedPaths.some(path => currentPath.startsWith(path));

    if (isProtected) {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Debes iniciar sesión primero.");
            window.location.href = "/pages/login.html";
        }
    }
});