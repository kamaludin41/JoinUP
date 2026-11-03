import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/api";

function EventDetails({ event, onBack }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    title: event?.title || "",
    description: event?.description || "",
    location: event?.location || "",
    category: event?.category || "Viihde",
    date: event?.date || "",
    time: event?.time || "",
  });

  useEffect(() => {
    let cancelled = false;

    async function checkRegistration() {
      if (!event?.id) {
        setIsRegistered(false);
        setCheckingRegistration(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/registrations`);
        if (!response.ok) throw new Error("Ilmoittautumisten haku epäonnistui.");

        const registrations = await response.json();

        const alreadyRegistered = registrations.some(
          (registration) =>
            Number(registration.user_id) === 1 &&
            Number(registration.event_id) === Number(event.id)
        );

        if (!cancelled) setIsRegistered(alreadyRegistered);
      } catch (error) {
        if (!cancelled) setMessage(error.message);
      } finally {
        if (!cancelled) setCheckingRegistration(false);
      }
    }

    checkRegistration();

    return () => {
      cancelled = true;
    };
  }, [event?.id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegister() {
    if (!event?.id || isRegistered || loading || checkingRegistration) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/events/${event.id}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: 1 }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) setIsRegistered(true);
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

  async function handleSave() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Tapahtuman muokkaus epäonnistui.");
      }

      setMessage("Tapahtuma päivitettiin!");
      setEditing(false);
      await onBack();
    } catch (error) {
      setMessage(error.message || "Palvelimeen ei saatu yhteyttä.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Haluatko varmasti poistaa tapahtuman?")) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/events/${event.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Tapahtuman poistaminen epäonnistui.");
      }

      await onBack();
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
        <button type="button" onClick={onBack}>Takaisin tapahtumiin</button>
      </main>
    );
  }

  return (
    <main className="container section">
      <button type="button" onClick={onBack}>← Takaisin</button>

      <div className="details-card">
        {editing ? (
          <>
            <h1>Muokkaa tapahtumaa</h1>

            <form
              className="event-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <label>Tapahtuman nimi</label>
              <input name="title" value={form.title} onChange={handleChange} required />

              <label>Kuvaus</label>
              <textarea name="description" value={form.description} onChange={handleChange} />

              <label>Paikka</label>
              <input name="location" value={form.location} onChange={handleChange} required />

              <label>Kategoria</label>
              <input name="category" value={form.category} onChange={handleChange} required />

              <label>Päivämäärä</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required />

              <label>Aika</label>
              <input type="time" name="time" value={form.time} onChange={handleChange} required />

              <button type="submit" disabled={loading}>
                {loading ? "Tallennetaan..." : "Tallenna muutokset"}
              </button>

              <button type="button" onClick={() => setEditing(false)}>
                Peruuta
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="event-emoji">{event.emoji || "🎉"}</div>
            <span className="category">{event.category}</span>
            <h1>{event.title}</h1>
            <p>{event.description}</p>
            <p>📍 Paikka: {event.location}</p>
            <p>📅 Päivämäärä: {event.date}</p>
            <p>🕒 Aika: {event.time}</p>

            {event.max_participants != null && (
              <p>
                👥 Osallistujia: {event.participants || 0} / {event.max_participants}
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

            <hr />
            <div className="event-actions">
              <button type="button" onClick={() => setEditing(true)}>
                Muokkaa tapahtumaa
              </button>

              <button type="button" onClick={handleDelete} disabled={loading}>
                Poista tapahtuma
              </button>
            </div>
          </>
        )}

        {message && <p role="status">{message}</p>}
      </div>
    </main>
  );
}

export default EventDetails;
