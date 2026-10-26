export default function Favorites({ favorites = [] }) {
  return (
    <main className="page">
      <h1>Suosikkini</h1>
      <p>Tallentamasi tapahtumat löytyvät täältä.</p>

      {favorites.length === 0 ? (
        <p>Et ole vielä lisännyt suosikkeja.</p>
      ) : (
        <div className="event-grid">
          {favorites.map((event) => (
            <article className="event-card" key={event.id ?? event.title}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>📍 {event.location}</p>
              <p>📅 {event.date}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
