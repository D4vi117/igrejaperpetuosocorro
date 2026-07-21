import { locations } from "/src/data/locations.js";

const locationList = document.getElementById("locationList");

function createLocationImage(location) {
    const media = document.createElement("div");
    media.className = "location-card-media";

    if (!location.imageUrl) {
        const placeholder = document.createElement("span");
        placeholder.textContent = "Foto em breve";
        media.classList.add("is-placeholder");
        media.append(placeholder);
        return media;
    }

    const image = document.createElement("img");
    image.src = location.imageUrl;
    image.alt = `Fachada de ${location.name}`;
    image.loading = "lazy";
    media.append(image);
    return media;
}

function createLocationMap(location) {
    const mapContainer = document.createElement("div");
    const mapFrame = document.createElement("iframe");
    const openMapsLink = document.createElement("a");

    mapContainer.className = "location-card-map";
    mapFrame.src = location.embedMapUrl;
    mapFrame.title = `Mapa de ${location.name}`;
    mapFrame.loading = "lazy";
    mapFrame.referrerPolicy = "no-referrer-when-downgrade";
    mapFrame.setAttribute("allowfullscreen", "");

    openMapsLink.className = "open-maps-link";
    openMapsLink.href = location.mapUrl;
    openMapsLink.target = "_blank";
    openMapsLink.rel = "noopener noreferrer";
    openMapsLink.textContent = "Abrir no Google Maps";
    openMapsLink.setAttribute("aria-label", `Abrir ${location.name} no Google Maps`);

    mapContainer.append(mapFrame, openMapsLink);
    return mapContainer;
}

function createLocationCard(location, position) {
    const listItem = document.createElement("li");
    const content = document.createElement("div");
    const titleRow = document.createElement("div");
    const number = document.createElement("span");
    const heading = document.createElement("h2");
    const address = document.createElement("address");

    listItem.className = "location-card";
    content.className = "location-card-content";
    titleRow.className = "location-card-title";
    number.className = "location-number";
    number.textContent = String(position + 1);
    heading.textContent = location.name;
    address.textContent = location.address;

    titleRow.append(number, heading);
    content.append(titleRow, address);
    listItem.append(
        createLocationImage(location),
        content,
        createLocationMap(location),
    );
    return listItem;
}

if (locationList) {
    const cards = locations.map(createLocationCard);
    locationList.replaceChildren(...cards);
}
