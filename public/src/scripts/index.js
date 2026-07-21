const sidebar = document.querySelector(".sidebar");
const menuButton = document.querySelector(".menu-icon");

function setSidebarOpen(isOpen) {
    if (!sidebar) {
        return;
    }

    sidebar.classList.toggle("active", isOpen);
    menuButton?.setAttribute("aria-expanded", String(isOpen));
}

function toggleSidebar() {
    setSidebarOpen(!sidebar?.classList.contains("active"));
}

window.toggleSidebar = toggleSidebar;

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setSidebarOpen(false);
    }
});
