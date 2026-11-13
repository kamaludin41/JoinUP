import { useState, useEffect } from "react";
import { getEventEmoji } from "../utils/eventEmoji";

const API_URL = "http://localhost:3001/api";
const USER_ID = 1;

function getInitialForm(event) {
  return {
    title: event?.title || "",
    description: event?.description || "",
    location: event?.location || "",
    category: event?.category || "Vapaa-aika",
    date: String(event?.date || "").slice(0, 10),
    time: String(event?.time || "").slice(0, 5),
  };
}

function EventDetails({ event, onBack }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [form, setForm] = useState(() => getInitialForm(event));

  // Reset when event changes
  useEffect(() => {
    setForm(getInitialForm(event));
    setEditing(false);
    setMessage("");
    setShowCancelModal(false);
  }, [event?.id]);

  // Check registration
  useEffect(() => {
    let cancelled = false;

    async function checkRegistration() {
      setCheckingRegistration(true);
      setIsRegistered(false);

      if (!event?.id) {
        setCheckingRegistration(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/registrations`);

        if (!response.ok) {
          throw new Error("Ilmoittautumisten haku epäonnistui.");
        }

        const registrations = await response.json();

        const alreadyRegistered = registrations.some(
          (registration) =>
            Number(registration.user_id) === USER_ID &&
            Number(registration.event_id) === Number(event.id)
        );

        if (!cancelled) {
          setIsRegistered(alreadyRegistered);
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error.message);
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

  // Form changes
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Register
  async function handleRegister() {
    if (!event?.id || isRegistered || loading || checkingRegistration) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/events/${event.id}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: USER_ID }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (
          response.status === 409 &&
          data.error === "Olet jo ilmoittautunut"
        ) {
          setIsRegistered(true);
        }

        throw new Error(
          data.error || "Ilmoittautuminen epäonnistui."
        );
      }

      setIsRegistered(true);
      setMessage("Ilmoittautuminen onnistui!");
    } catch (error) {
      setMessage(
        error.message || "Palvelimeen ei saatu yhteyttä."
      );
    } finally {
      setLoading(false);
    }
  }

  // Cancel registration
  async function handleCancelRegistration() {
    if (!event?.id || !isRegistered || loading || checkingRegistration) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/events/${event.id}/register`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: USER_ID }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Ilmoittautumisen peruminen epäonnistui."
        );
      }

      setIsRegistered(false);
      setShowCancelModal(false);
      setMessage("Ilmoittautuminen peruttu onnistuneesti!");
    } catch (error) {
      setMessage(
        error.message || "Palvelimeen ei saatu yhteyttä."
      );
      setShowCancelModal(false);
    } finally {
      setLoading(false);
    }
  }

  // Save edited event
  async function handleSave(e) {
    e.preventDefault();
    if (!event?.id || loading) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/events/${event.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Tapahtuman muokkaus epäonnistui."
        );
      }

      setMessage("Tapahtuma päivitettiin!");
      setEditing(false);
      await onBack();
    } catch (error) {
      setMessage(
        error.message || "Palvelimeen ei saatu yhteyttä."
      );
    } finally {
      setLoading(false);
    }
  }

  // Delete event
  async function handleDelete() {
    if (!event?.id || loading) return;

    const confirmed = window.confirm(
      "Haluatko varmasti poistaa tapahtuman?"
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/events/${event.id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Tapahtuman poistaminen epäonnistui."
        );
      }

      await onBack();
    } catch (error) {
      setMessage(
        error.message || "Palvelimeen ei saatu yhteyttä."
      );
    } finally {
      setLoading(false);
    }
  }

  function cancelEditing() {
    setForm(getInitialForm(event));
    setEditing(false);
    setMessage("");
  }

  if (!event) {
    return (
      <main className="event-details-page">
        <div className="event-details-container">
          <p>Tapahtumaa ei löytynyt.</p>
          <button
            type="button"
            className="event-back-button"
            onClick={onBack}
          >
            ← Takaisin tapahtumiin
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="event-details-page">
      <div className="event-details-container">
        <button
          type="button"
          className="event-back-button"
          onClick={onBack}
        >
          ← Takaisin
        </button>

        {editing ? (
          <div className="event-edit-wrapper">
            <div className="create-event-heading">
              <span className="create-event-tag">
                ✨ MUOKKAA TAPAHTUMAA
              </span>
              <h1>
                Muokkaa <span>tapahtumaa</span>
              </h1>
              <p>Päivitä tapahtumasi tiedot helposti.</p>
            </div>

            <form
              className="event-form event-edit-form"
              onSubmit={handleSave}
            >
              <div className="form-section-title">
                <div className="form-icon">📅</div>
                <div>
                  <h2>Tapahtuman tiedot</h2>
                  <p>Muokkaa tapahtuman perustietoja.</p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit-title">
                  Tapahtuman nimi
                </label>
                <input
                  id="edit-title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Esim. Lautapeli-ilta"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-category">
                  Kategoria
                </label>
                <select
                  id="edit-category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  {[
                    "Viihde",
                    "Koulutus",
                    "Teknologia",
                    "Urheilu",
                    "Ura",
                    "Vapaa-aika",
                    "Pelit",
                    "Opiskelu",
                    "Liikunta",
                    "Jalkapallo",
                    "Kahvittelu",
                    "Kokkaus",
                    "Elokuvat",
                    "Musiikki",
                    "Tanssi",
                    "Jooga",
                  ].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">
                  Kuvaus
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Kerro vähän lisää tapahtumastasi..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-location">
                  Paikka
                </label>
                <input
                  id="edit-location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Esim. Koulun oleskelutila"
                  required
                />
              </div>

              <div className="event-time-section">
                <h3>Tapahtuman ajankohta</h3>

                <div className="event-time-grid">
                  <div className="time-block">
                    <label htmlFor="edit-date">
                      Alkaa
                    </label>

                    <div className="time-input-row">
                      <input
                        id="edit-date"
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                      />
                      <input
                        name="time"
                        type="time"
                        aria-label="Alkamisaika"
                        value={form.time}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="edit-form-actions">
                <button
                  type="submit"
                  className="create-event-button"
                  disabled={loading}
                >
                  {loading
                    ? "Tallennetaan..."
                    : "✓ Tallenna muutokset"}
                </button>

                <button
                  type="button"
                  className="edit-cancel-button"
                  onClick={cancelEditing}
                  disabled={loading}
                >
                  Peruuta
                </button>
              </div>

              {message && (
                <p className="error" role="alert">
                  {message}
                </p>
              )}
            </form>
          </div>
        ) : (
          <div className="details-card event-view-card">
            <div className="event-emoji">
              {getEventEmoji(event)}
            </div>

            <span className="category">
              {event.category}
            </span>

            <h1>{event.title}</h1>
            <p>{event.description}</p>

            <div className="event-detail-info">
              <p>📍 Paikka: {event.location}</p>
              <p>📅 Päivämäärä: {event.date}</p>
              <p>🕒 Aika: {event.time}</p>

              {event.max_participants != null && (
                <p>
                  👥 Osallistujia: {event.participants || 0} /{" "}
                  {event.max_participants}
                </p>
              )}
            </div>

            <div className="registration-actions">
              {checkingRegistration ? (
                <button
                  type="button"
                  className="event-register-button"
                  disabled
                >
                  Tarkistetaan ilmoittautumista...
                </button>
              ) : isRegistered ? (
                <>
                  <div className="registration-success">
                    ✓ Olet jo ilmoittautunut tapahtumaan
                  </div>

                  <button
                    type="button"
                    className="cancel-registration-button"
                    onClick={() => {
                      setMessage("");
                      setShowCancelModal(true);
                    }}
                    disabled={loading}
                  >
                    Peru ilmoittautuminen
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="event-register-button"
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading
                    ? "Ilmoittaudutaan..."
                    : "Ilmoittaudu tapahtumaan"}
                </button>
              )}
            </div>

            <hr />

            <div className="event-actions">
              <button
                type="button"
                onClick={() => {
                  setForm(getInitialForm(event));
                  setMessage("");
                  setEditing(true);
                }}
                disabled={loading}
              >
                Muokkaa tapahtumaa
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
              >
                Poista tapahtuma
              </button>
            </div>

            {message && (
              <p role="status">{message}</p>
            )}
          </div>
        )}
      </div>

      
      {showCancelModal && (
        <div
          className="joinup-modal-overlay"
          onClick={() => {
            if (!loading) setShowCancelModal(false);
          }}
        >
          <div
            className="joinup-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="joinup-modal-icon">
              ✕
            </div>

            <h2 id="cancel-modal-title">
              Peru ilmoittautuminen?
            </h2>

            <p>
              Haluatko varmasti perua ilmoittautumisesi
              tapahtumaan <strong>{event.title}</strong>?
            </p>

            <div className="joinup-modal-actions">
              <button
                type="button"
                className="joinup-modal-back"
                onClick={() => setShowCancelModal(false)}
                disabled={loading}
              >
                Takaisin
              </button>

              <button
                type="button"
                className="joinup-modal-confirm"
                onClick={handleCancelRegistration}
                disabled={loading}
              >
                {loading ? "Perutaan..." : "Kyllä, peru"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default EventDetails;
