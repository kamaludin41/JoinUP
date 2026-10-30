import { useState } from "react";
import EventCard from "../components/EventCard";

function Events({ events = [], onSelect }) {
  const [category, setCategory] = useState("Kaikki");

  // Kategoriat tulevat backendin tapahtumista
  const categories = [
    "Kaikki",
    ...new Set(events.map((event) => event.category).filter(Boolean)),
  ];

  // Suodatetaan backendistä saadut tapahtumat
  const filteredEvents =
    category === "Kaikki"
      ? events
      : events.filter((event) => event.category === category);

  return (
    <main className="container section">
      <h1>Tapahtumat</h1>
      <p>Löydä kiinnostavaa tekemistä.</p>

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
          <EventCard key={event.id} event={event} onSelect={onSelect} />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <p>Tässä kategoriassa ei ole vielä tapahtumia.</p>
      )}
    </main>
  );
}

export default Events;
