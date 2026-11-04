
import { useState } from "react";
import EventCard from "../components/EventCard";
import SearchBar from "../components/SearchBar";

function Events({ events = [], onSelect }) {
  const [category, setCategory] = useState("Kaikki");
  const [search, setSearch] = useState("");

  const categories = [
    "Kaikki",
    ...new Set(events.map((event) => event.category).filter(Boolean)),
  ];

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      category === "Kaikki" || event.category === category;

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      (event.title || "").toLowerCase().includes(searchText) ||
      (event.description || "").toLowerCase().includes(searchText) ||
      (event.location || "").toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="container section">

      <div className="events-header">
        <div className="events-heading">
          <h1>Tapahtumat</h1>
          <p>Löydä kiinnostavaa tekemistä.</p>
        </div>

        <SearchBar search={search} setSearch={setSearch} />
      </div>

      <div className="filters">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={category === item ? "active" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="event-grid">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onSelect={onSelect}
          />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <p>Hakua vastaavia tapahtumia ei löytynyt.</p>
      )}
    </main>
  );
}

export default Events;
