
import { useState, useEffect } from "react";
import { getEventEmoji } from "../utils/eventEmoji";
import { EVENT_CATEGORIES } from "../utils/eventCategories";

const API_URL = "http://localhost:3001/api";

function getInitialForm(event) {
  const category = event?.category || "Vapaa-aika";

  const categoryData = EVENT_CATEGORIES.find(
    (item) => item.name === category
  );

  const subcategory =
    event?.subcategory ||
    (categoryData?.subcategories.includes(event?.category)
      ? event.category
      : categoryData?.subcategories[0]) ||
    "";

  return {
    title: event?.title || "",
    description: event?.description || "",
    location: event?.location || "",
    category,
    subcategory,
    date: String(event?.date || "").slice(0, 10),
    time: String(event?.time || "").slice(0, 5),
  };
}

function EventDetails({ event, onBack, token, currentUser }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [form, setForm] = useState(() => getInitialForm(event));
  const [savedEvent, setSavedEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const displayEvent = savedEvent || event;

const isPastEvent = displayEvent
  ? new Date(
      `${String(displayEvent.date).slice(0, 10)}T${String(
        displayEvent.time || "00:00"
      ).slice(0, 5)}:00`
    ).getTime() <= Date.now()
  : false;

  


  const selectedCategory = EVENT_CATEGORIES.find(
    (item) => item.name === form.category
  );

  useEffect(() => {
    if (!message || !message.includes("onnist")) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    setForm(getInitialForm(event));
    setSavedEvent(null);
    setEditing(false);
    setMessage("");
    setShowCancelModal(false);
    setShowDeleteModal(false);
  }, [event?.id]);

  // Check registration
  useEffect(() => {
    let cancelled = false;

    async function checkRegistration() {
      setCheckingRegistration(true);

      if (!event?.id || !token || !currentUser?.id) {
        setIsRegistered(false);
        setCheckingRegistration(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/events/${event.id}/registration`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Ilmoittautumisen tarkistus epäonnistui.");
        }

        const data = await response.json();

        if (!cancelled) {
          setIsRegistered(data.isRegistered);
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
  }, [event?.id, token, currentUser?.id]);

  // Form changes
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleCategoryChange(e) {
    const newCategory = e.target.value;

    const categoryData = EVENT_CATEGORIES.find(
      (item) => item.name === newCategory
    );

    setForm((previous) => ({
      ...previous,
      category: newCategory,
      subcategory: categoryData?.subcategories[0] || "",
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
      if (!token || !currentUser?.id) {
        throw new Error("Kirjaudu sisään ilmoittautuaksesi.");
      }

      const response = await fetch(
        `${API_URL}/events/${event.id}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
            Authorization: `Bearer ${token}`,
          },
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
      setMessage(error.message || "Palvelimeen ei saatu yhteyttä.");
    } finally {
      setLoading(false);
    }
  }

  // Save event edits
  async function handleSave(e) {
    e.preventDefault();

    if (!event?.id || loading) return;

    setLoading(true);
    setMessage("");

    try {
      if (!token) {
        throw new Error("Kirjaudu ensin sisään.");
      }

      const response = await fetch(`${API_URL}/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Tapahtuman muokkaus epäonnistui.");
      }

      const updatedEvent = {
        ...event,
        ...form,
      };

      setSavedEvent(updatedEvent);
      setForm(getInitialForm(updatedEvent));
      setEditing(false);
      setMessage("✓ Tapahtuman muokkaus onnistui!");
    } catch (error) {
      setMessage(error.message || "Palvelimeen ei saatu yhteyttä.");
    } finally {
      setLoading(false);
    }
  }

  // Delete event
  function handleDelete() {
    if (!event?.id || loading) return;
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    if (!event?.id || loading) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/events/${event.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Tapahtuman poistaminen epäonnistui.");
      }

      setShowDeleteModal(false);
      await onBack();
    } catch (error) {
      setMessage(error.message || "Palvelimeen ei saatu yhteyttä.");
    } finally {
      setLoading(false);
    }
  }

  function cancelEditing() {
    setForm(getInitialForm(displayEvent));
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
        {/* BACK BUTTON */}
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

              {/* TITLE */}
              <div className="form-group">
                <label htmlFor="edit-title">Tapahtuman nimi</label>

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

              {/* MAIN CATEGORY */}
              <div className="form-group">
                <label htmlFor="edit-category">Kategoria</label>

                <select
                  id="edit-category"
                  name="category"
                  value={form.category}
                  onChange={handleCategoryChange}
                  required
                >
                  {EVENT_CATEGORIES.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.icon} {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUBCATEGORY */}
              <div className="form-group">
                <label htmlFor="edit-subcategory">Alakategoria</label>

                <select
                  id="edit-subcategory"
                  name="subcategory"
                  value={form.subcategory}
                  onChange={handleChange}
                  required
                >
                  {selectedCategory?.subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* DESCRIPTION */}
              <div className="form-group">
                <label htmlFor="edit-description">Kuvaus</label>

                <textarea
                  id="edit-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Kerro vähän lisää tapahtumastasi..."
                  rows={4}
                />
              </div>

              {/* LOCATION */}
              <div className="form-group">
                <label htmlFor="edit-location">Paikka</label>

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

              {/* DATE AND TIME */}
              <div className="event-time-section">
                <h3>Tapahtuman ajankohta</h3>

                <div className="event-time-grid">
                  <div className="time-block">
                    <label htmlFor="edit-date">Alkaa</label>

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

              {/* ACTIONS */}
              <div className="edit-form-actions">
                <button
                  type="submit"
                  className="create-event-button"
                  disabled={loading}
                >
                  {loading ? "Tallennetaan..." : "✓ Tallenna muutokset"}
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
            {message && (
              <div
                className={`event-toast ${
                  message.includes("onnist")
                    ? "event-toast-success"
                    : "event-toast-error"
                }`}
                role="status"
              >
                <span className="event-toast-icon">
                  {message.includes("onnist") ? "✓" : "!"}
                </span>

                <span>{message}</span>
              </div>
            )}

            <div className="event-emoji">
              {getEventEmoji(displayEvent)}
            </div>

            <span className="category">
              {displayEvent.category}
              {displayEvent.subcategory &&
                ` · ${displayEvent.subcategory}`}
            </span>

            <h1>{displayEvent.title}</h1>

            <p>{displayEvent.description}</p>

            <div className="event-detail-info">
              <p>📍 Paikka: {displayEvent.location}</p>
              <p>📅 Päivämäärä: {displayEvent.date}</p>
              <p>🕒 Aika: {displayEvent.time}</p>

              {displayEvent.max_participants != null && (
                <p>
                  👥 Osallistujia: {displayEvent.participants || 0} /{" "}
                  {displayEvent.max_participants}
                </p>
              )}
            </div>

           
            {/* REGISTRATION */}
            <div className="registration-actions">

              {isPastEvent ? (
                <div className="registration-success">
                  ✓ Tämä tapahtuma on jo päättynyt.
                </div>
              ) : checkingRegistration ? (
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
                    {loading ? "Perutaan..." : "Peru ilmoittautuminen"}
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


            {/* OWNER ACTIONS */}
            {currentUser &&
              String(event.organizer_id) === String(currentUser.id) && (
                <div className="event-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setForm(getInitialForm(displayEvent));
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
              )}

            {/* DELETE MODAL */}
            {showDeleteModal && (
              <div
                className="joinup-modal-overlay"
                onClick={() => {
                  if (!loading) setShowDeleteModal(false);
                }}
              >
                <div
                  className="joinup-modal"
                  role="dialog"
                  aria-modal="true"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="joinup-modal-icon">🗑️</div>

                  <h2>Poista tapahtuma?</h2>

                  <p>
                    Haluatko varmasti poistaa tapahtuman{" "}
                    <strong>{displayEvent.title}</strong>?
                    Tätä toimintoa ei voi peruuttaa.
                  </p>

                  <div className="joinup-modal-actions">
                    <button
                      type="button"
                      className="joinup-modal-back"
                      onClick={() => setShowDeleteModal(false)}
                      disabled={loading}
                    >
                      Peruuta
                    </button>

                    <button
                      type="button"
                      className="joinup-modal-confirm"
                      onClick={confirmDelete}
                      disabled={loading}
                    >
                      {loading ? "Poistetaan..." : "Kyllä, poista"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CANCEL REGISTRATION MODAL */}
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
                  <div className="joinup-modal-icon">✕</div>

                  <h2 id="cancel-modal-title">
                    Peru ilmoittautuminen?
                  </h2>

                  <p>
                    Haluatko varmasti perua ilmoittautumisesi tapahtumaan{" "}
                    <strong>{displayEvent.title}</strong>?
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
          </div>
        )}
      </div>
    </main>
  );
}

export default EventDetails;
