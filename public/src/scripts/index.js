export function initializeNavigation(header) {
    const sidebar = header.querySelector(".sidebar");
    const menuButton = header.querySelector(".menu-icon");
    const closeButton = header.querySelector(".close-btn");
    const sidebarLinks = sidebar?.querySelectorAll("a") ?? [];

    if (!sidebar || !menuButton) {
        return;
    }

    function setSidebarOpen(isOpen, returnFocus = false) {
        sidebar.classList.toggle("active", isOpen);
        sidebar.setAttribute("aria-hidden", String(!isOpen));
        sidebar.inert = !isOpen;
        menuButton.setAttribute("aria-expanded", String(isOpen));

        if (isOpen) {
            closeButton?.focus();
        } else if (returnFocus) {
            menuButton.focus();
        }
    }

    menuButton.addEventListener("click", () => setSidebarOpen(true));
    closeButton?.addEventListener("click", () => setSidebarOpen(false, true));
    sidebarLinks.forEach((link) => {
        link.addEventListener("click", () => setSidebarOpen(false));
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setSidebarOpen(false, true);
        }
    });
}
