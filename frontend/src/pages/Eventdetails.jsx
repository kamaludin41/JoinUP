function EventDetails({ event, onBack }) {
  if (!event) {
    return (
      <main className="container section">
        <p>Tapahtumaa ei löytynyt.</p>
        <button onClick={onBack}>Takaisin tapahtumiin</button>
      </main>
    );
  }

  return (
    <main className="container section">
      <button onClick={onBack}>← Takaisin</button>

      <div className="details-card">
        <div className="event-emoji">{event.emoji || "🎉"}</div>
        <span className="category">{event.category}</span>
        <h1>{event.title}</h1>
        <p>{event.description}</p>
        <p>📍 Paikka: {event.location}</p>
        <p>📅 Päivämäärä: {event.date}</p>
        <p>🕒 Aika: {event.time}</p>
      </div>
    </main>
  );
}

export default EventDetails;
