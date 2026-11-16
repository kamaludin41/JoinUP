import { useState } from "react";

function CreateEvent({ onCreate, setPage }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Vapaa-aika");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const start = new Date(`${date}T${time}`);
    const end = new Date(`${endDate}T${endTime}`);

    if (end <= start) {
      setError(
        "Päättymisajan täytyy olla alkamisajan jälkeen."
      );
      return;
    }

    setLoading(true);

    try {
      await onCreate({
        title,
        category,
        description,
        location,
        date,
        time,
        endDate,
        endTime,
      });

      setPage("events");
    } catch (err) {
      setError(
        err?.message || "Tapahtuman luominen epäonnistui."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="create-event-page">
      <div className="create-event-container">

       
        <div className="create-event-heading">
          <span className="create-event-tag">
            ✨ UUSI TAPAHTUMA
          </span>

          <h1>
            Luo uusi <span>tapahtuma</span>
          </h1>

         
        </div>

   
        <form
          className="event-form"
          onSubmit={handleSubmit}
        >

          <div className="form-section-title">
            <div className="form-icon">
              📅
            </div>

            <div>
              <h2>Tapahtuman tiedot</h2>
              <p>Täytä tapahtuman perustiedot.</p>
            </div>
          </div>

          {/* EVENT NAME AND CATEGORY */}
          <div className="form-row event-details-row">

            <div className="form-group">
              <label htmlFor="event-title">
                Tapahtuman nimi
                <span className="required"> *</span>
              </label>

              <input
                id="event-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Esim. Lautapeli-ilta"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-category">
                Kategoria
                <span className="required"> *</span>
              </label>

              <select
                id="event-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option>Viihde</option>
                <option>Koulutus</option>
                <option>Teknologia</option>
                <option>Urheilu</option>
                <option>Ura</option>
                <option>Vapaa-aika</option>
              </select>
            </div>

          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <label htmlFor="event-description">
              Kuvaus
              <span className="required"> *</span>
            </label>

            <textarea
              id="event-description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Kerro vähän lisää tapahtumastasi..."
              rows={3}
              required
            />
          </div>

          {/* LOCATION */}
          <div className="form-group">
            <label htmlFor="event-location">
              Paikka
              <span className="required"> *</span>
            </label>

            <input
              id="event-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Esim. Koulun oleskelutila"
              required
            />
          </div>

         
          <div className="event-time-section">

            <h3>
              Aika
              <span className="required"> *</span>
            </h3>

            <div className="event-time-grid">

              {/* START */}
              <div className="time-block">
                <label htmlFor="event-date">
                  Alkaa
                </label>

                <div className="time-input-row">
                  <input
                    id="event-date"
                    type="date"
                    value={date}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      setDate(selectedDate);

                      if (
                        !endDate ||
                        endDate < selectedDate
                      ) {
                        setEndDate(selectedDate);
                      }
                    }}
                    required
                  />

                  <input
                    id="event-time"
                    aria-label="Alkamisaika"
                    type="time"
                    value={time}
                    onChange={(e) =>
                      setTime(e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* END */}
              <div className="time-block">
                <label htmlFor="event-end-date">
                  Päättyy
                </label>

                <div className="time-input-row">
                  <input
                    id="event-end-date"
                    type="date"
                    min={date || undefined}
                    value={endDate}
                    onChange={(e) =>
                      setEndDate(e.target.value)
                    }
                    required
                  />

                  <input
                    id="event-end-time"
                    aria-label="Päättymisaika"
                    type="time"
                    value={endTime}
                    onChange={(e) =>
                      setEndTime(e.target.value)
                    }
                    required
                  />
                </div>
              </div>

            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="create-event-button"
            disabled={loading}
          >
            {loading
              ? "Tallennetaan..."
              : "⊕ Luo tapahtuma"}
          </button>

          

        </form>
      </div>
    </main>
  );
}

export default CreateEvent;
