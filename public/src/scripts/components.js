import { initializeNavigation } from "/src/scripts/index.js";

const componentPaths = Object.freeze({
    "site-header": "/components/header.html",
    "site-footer": "/components/footer.html",
});

function normalizePath(pathname) {
    const normalizedPath = pathname.replace(/\/index\.html$/, "").replace(/\/$/, "");
    return normalizedPath || "/";
}

function markActiveNavigation(header) {
    const currentPath = normalizePath(window.location.pathname);

    header.querySelectorAll("[data-route]").forEach((link) => {
        const route = link.dataset.route;
        const isHome = route === "/" && currentPath === "/";
        const isCurrentSection = route !== "/" && currentPath.startsWith(route);

        if (isHome || isCurrentSection) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

async function loadComponent(id, path) {
    const placeholder = document.getElementById(id);

    if (!placeholder) {
        return null;
    }

    const response = await fetch(path, {
        credentials: "same-origin",
        headers: { Accept: "text/html" },
    });

    if (!response.ok) {
        throw new Error(`Não foi possível carregar ${path}: HTTP ${response.status}`);
    }

    const template = document.createElement("template");
    template.innerHTML = await response.text();
    const component = template.content.firstElementChild;

    if (!component) {
        throw new Error(`O componente ${path} está vazio.`);
    }

    placeholder.replaceWith(component);
    return component;
}

async function initializeComponents() {
    try {
        const [header] = await Promise.all(
            Object.entries(componentPaths).map(([id, path]) => loadComponent(id, path)),
        );

        if (header) {
            markActiveNavigation(header);
            initializeNavigation(header);
        }
    } catch (error) {
        console.error("Erro ao carregar os componentes compartilhados.", error);
    }
}

initializeComponents();
