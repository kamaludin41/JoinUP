import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/api";

function EventDetails({ event, onBack }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Tarkista, onko käyttäjä jo ilmoittautunut tapahtumaan
  useEffect(() => {
    let cancelled = false;

    async function checkRegistration() {
      if (!event?.id) {
        setIsRegistered(false);
        setCheckingRegistration(false);
        return;
      }

      setCheckingRegistration(true);
      setMessage("");

      try {
        const response = await fetch(`${API_URL}/registrations`);

        if (!response.ok) {
          throw new Error("Ilmoittautumisten haku epäonnistui.");
        }

        const registrations = await response.json();

        const alreadyRegistered = registrations.some(
          (registration) =>
            Number(registration.user_id) === 1 &&
            Number(registration.event_id) === Number(event.id),
        );

        if (!cancelled) {
          setIsRegistered(alreadyRegistered);
        }
      } catch (error) {
        console.error("Ilmoittautumisen tarkistus epäonnistui:", error);

        if (!cancelled) {
          setMessage(
            "Ilmoittautumisen tilaa ei voitu tarkistaa. Yritä päivittää sivu.",
          );
        }
      } finally {
        if (!cancelled) {
          setCheckingRegistration(false);
        }
      }
    }

    checkRegistration();

    return () => {
      cancelled = true;
    };
  }, [event?.id]);

  // Ilmoittaudu tapahtumaan
  async function handleRegister() {
    if (!event?.id || isRegistered || loading || checkingRegistration) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/events/${event.id}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: 1 }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setIsRegistered(true);
        }

        throw new Error(data.error || "Ilmoittautuminen epäonnistui.");
      }

      setIsRegistered(true);
      setMessage("Ilmoittautuminen onnistui!");
    } catch (error) {
      setMessage(error.message || "Palvelimeen ei saatu yhteyttä.");
    } finally {
      setLoading(false);
    }
  }

  if (!event) {
    return (
      <main className="container section">
        <p>Tapahtumaa ei löytynyt.</p>

        <button type="button" onClick={onBack}>
          Takaisin tapahtumiin
        </button>
      </main>
    );
  }

  return (
    <main className="container section">
      <button type="button" onClick={onBack}>
        ← Takaisin
      </button>

      <div className="details-card">
        <div className="event-emoji">{event.emoji || "🎉"}</div>

        <span className="category">{event.category}</span>

        <h1>{event.title}</h1>

        <p>{event.description}</p>
        <p>📍 Paikka: {event.location}</p>
        <p>📅 Päivämäärä: {event.date}</p>
        <p>🕒 Aika: {event.time}</p>

        {event.max_participants != null && (
          <p>
            👥 Osallistujia: {event.participants || 0} /{" "}
            {event.max_participants}
          </p>
        )}

        <button
          type="button"
          onClick={handleRegister}
          disabled={loading || checkingRegistration || isRegistered}
        >
          {checkingRegistration
            ? "Tarkistetaan ilmoittautumista..."
            : isRegistered
              ? "Olet jo ilmoittautunut ✓"
              : loading
                ? "Ilmoittaudutaan..."
                : "Ilmoittaudu tapahtumaan"}
        </button>

        {message && (
          <p role="status" aria-live="polite">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}

export default EventDetails;
