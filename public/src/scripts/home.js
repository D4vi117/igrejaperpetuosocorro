const eventsList = document.getElementById("eventsList");

function createEventCard(event) {
    const article = document.createElement("article");
    const title = document.createElement("h3");
    const date = document.createElement("time");
    const description = document.createElement("p");

    article.className = "event-card";
    title.textContent = event.title;
    date.dateTime = event.date;
    date.textContent = event.displayDate;
    description.textContent = event.description;
    article.append(title, date, description);
    return article;
}

function renderUpcomingEvents(upcomingEvents) {
    if (!eventsList) {
        return;
    }

    if (upcomingEvents.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "events-empty";
        emptyMessage.textContent = "Em breve, novas atividades serão divulgadas.";
        eventsList.replaceChildren(emptyMessage);
        return;
    }

    const cards = upcomingEvents.slice(0, 3).map(createEventCard);
    eventsList.replaceChildren(...cards);
}

renderUpcomingEvents([]);
