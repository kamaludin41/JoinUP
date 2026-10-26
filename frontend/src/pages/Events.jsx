import { useState } from "react";
import EventCard from "../components/EventCard";

function Events({ events, onSelect }) {
  const [category, setCategory] = useState("Kaikki");

  const categories = [
    "Kaikki",
    "Koulutus",
    "Teknologia",
    "Urheilu",
    "Viihde",
    "Ura",
    "Vapaa-aika",
  ];

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
