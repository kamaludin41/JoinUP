import { useEffect, useState } from "react";

const API_URL = "http://localhost:3001/api";

function MyRegistrations({ token }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRegistrations() {
      if (!token) {
        setError("Kirjaudu sisään nähdäksesi ilmoittautumisesi.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/my-registrations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Tapahtumien hakeminen epäonnistui.");
        }

        setRegistrations(data.registrations || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadRegistrations();
  }, [token]);

  if (loading) {
    return (
      <main className="container section">Ladataan ilmoittautumisia...</main>
    );
  }

  return (
    <main className="container section">
      <h1>Omat ilmoittautumiset</h1>
      <p>Tapahtumat, joihin olet ilmoittautunut.</p>

      {error && <p role="alert">{error}</p>}

      {!error && registrations.length === 0 && (
        <p>Et ole vielä ilmoittautunut yhteenkään tapahtumaan.</p>
      )}

      <div className="events-grid">
        {registrations.map((event) => (
          <article className="event-card" key={event.registration_id}>
            <div className="event-emoji">{event.emoji || "🎉"}</div>

            <h2>{event.title}</h2>

            <p>{event.description}</p>
            <p>📍 {event.location}</p>
            <p>📅 {event.date}</p>
            <p>🕒 {event.time}</p>

            <p>✓ Olet ilmoittautunut tähän tapahtumaan</p>
          </article>
        ))}
      </div>
    </main>
  );
}

export default MyRegistrations;
