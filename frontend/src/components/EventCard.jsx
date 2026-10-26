function EventCard({ event, onSelect }) {
  return (
    <article className="event-card">
      <div className="event-emoji">{event.emoji || "🎉"}</div>
      <div className="event-info">
        <span className="category">{event.category}</span>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <p>📍 {event.location}</p>
        <p>
          📅 {event.date} · {event.time}
        </p>
        <button onClick={() => onSelect(event)}>Katso tapahtuma</button>
      </div>
    </article>
  );
}

export default EventCard;
