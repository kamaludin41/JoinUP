
import { useMemo, useState } from "react";
import EventCard from "../components/EventCard";
import SearchBar from "../components/SearchBar";

import {
  EVENT_CATEGORIES,
  getMainCategory,
} from "../utils/eventCategories";

// Check whether an event has ended
function isPastEvent(event) {
  const date = String(event.date || "").slice(0, 10);
  const time = String(event.time || "00:00").slice(0, 5);

  const eventDate = new Date(`${date}T${time}:00`);

  if (Number.isNaN(eventDate.getTime())) {
    return false;
  }

  return eventDate.getTime() <= Date.now();
}

function Events({ events = [], onSelect }) {
  const [category, setCategory] = useState("Kaikki");
  const [search, setSearch] = useState("");

  // Filter events by category and search
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const mainCategory = getMainCategory(event);

      const matchesCategory =
        category === "Kaikki" || mainCategory === category;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        searchText === "" ||
        [
          event.title,
          event.description,
          event.location,
          event.category,
          event.subcategory,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(searchText)
          );

      return matchesCategory && matchesSearch;
    });
  }, [events, category, search]);

  // Separate upcoming and past events
  const upcomingEvents = filteredEvents.filter(
    (event) => !isPastEvent(event)
  );

  const pastEvents = filteredEvents.filter(
    (event) => isPastEvent(event)
  );

  return (
    <main className="container section">

      {/* HEADER */}
      <div className="events-header">
        <div className="events-heading">
          <h1>Tapahtumat</h1>
          <p>Löydä kiinnostavaa tekemistä ja uusia kavereita.</p>
        </div>

        <SearchBar search={search} setSearch={setSearch} />
      </div>

      {/* CATEGORY FILTERS */}
      <div className="filters">
        <button
          type="button"
          className={category === "Kaikki" ? "active" : ""}
          onClick={() => setCategory("Kaikki")}
        >
          ✨ Kaikki
        </button>

        {EVENT_CATEGORIES.map((item) => (
          <button
            key={item.name}
            type="button"
            className={category === item.name ? "active" : ""}
            onClick={() => setCategory(item.name)}
          >
            {item.icon} {item.name}
          </button>
        ))}
      </div>

      {/* UPCOMING EVENTS */}
      <section className="events-list-section">
        <div className="events-section-heading">
          <h2>Tulevat tapahtumat</h2>
          <span>{upcomingEvents.length}</span>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="event-grid">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={onSelect}
              />
            ))}
          </div>
        ) : (
          <p className="events-section-empty">
            Ei tulevia tapahtumia.
          </p>
        )}
      </section>

      {/* NO SEARCH RESULTS */}
      {filteredEvents.length === 0 && (
        <div className="events-empty">
          <span>🔎</span>
          <h3>Tapahtumia ei löytynyt</h3>
          <p>Kokeile toista kategoriaa tai hakusanaa.</p>

          <button
            type="button"
            onClick={() => {
              setCategory("Kaikki");
              setSearch("");
            }}
          >
            Näytä kaikki tapahtumat
          </button>
        </div>
      )}

    </main>
  );
}

export default Events;
