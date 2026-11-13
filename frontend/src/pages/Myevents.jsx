import { useEffect, useState } from "react";
import { getEventEmoji } from "../utils/eventEmoji";

const API_URL = "http://localhost:3001/api";

function Myevents({ token }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

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

        if (!cancelled) {
          setRegistrations(data);
        }
      } catch (error) {
        if (!cancelled) {
          setError(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRegistrations();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return (
      <main className="container section">Ladataan ilmoittautumisia...</main>
    );
  }

  return (
    <main className="container section">
      <h1>My Events</h1>
      <p>Tapahtumat, joihin olet ilmoittautunut.</p>

      {error && <p role="alert">{error}</p>}

      {!error && registrations.length === 0 && (
        <p>Et ole vielä ilmoittautunut yhteenkään tapahtumaan.</p>
      )}

      <div className="events-grid">
        {registrations.map((registration) => {
          const event = registration.event;

          return (
            <article className="event-card" key={registration.id}>
              <div className="event-emoji">{getEventEmoji(event)}</div>

              <h2>{event.title}</h2>

              <p>{event.description}</p>
              <p>📍 {event.location}</p>
              <p>📅 {event.date}</p>
              <p>🕒 {event.time}</p>

              <p>✓ Olet ilmoittautunut tähän tapahtumaan</p>
            </article>
          );
        })}
      </div>
    </main>
  );
}

export default Myevents;
