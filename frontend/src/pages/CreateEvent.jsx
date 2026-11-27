
import { useState } from "react";
import { EVENT_CATEGORIES } from "../utils/eventCategories";

function CreateEvent({ onCreate, setPage }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Vapaa-aika");
  const [subcategory, setSubcategory] = useState(
    EVENT_CATEGORIES.find((item) => item.name === "Vapaa-aika")
      ?.subcategories[0] || ""
  );

  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedCategory = EVENT_CATEGORIES.find(
    (item) => item.name === category
  );

  function handleCategoryChange(e) {
    const newCategory = e.target.value;
    setCategory(newCategory);

    const newCategoryData = EVENT_CATEGORIES.find(
      (item) => item.name === newCategory
    );

    setSubcategory(newCategoryData?.subcategories[0] || "");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const start = new Date(`${date}T${time}`);
    const end = new Date(`${endDate}T${endTime}`);

    if (
      !date ||
      !time ||
      !endDate ||
      !endTime ||
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      setError("Täytä alkamis- ja päättymisaika.");
      return;
    }

    if (end <= start) {
      setError("Päättymisajan täytyy olla alkamisajan jälkeen.");
      return;
    }

    setLoading(true);

    try {
      await onCreate({
        title,
        category,
        subcategory,
        description,
        location,
        date,
        time,
        endDate,
        endTime,
      });

      setPage("events");
    } catch (err) {
      setError(err?.message || "Tapahtuman luominen epäonnistui.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="create-event-page">
      <div className="create-event-container">
        <div className="create-event-heading">
          <h1>
            Luo uusi <span>tapahtuma</span>
          </h1>
        </div>

        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form-section-title">
            <div className="form-icon">📅</div>
            <div>
              <h2>Tapahtuman tiedot</h2>
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
          </div>

          {/* SUBCATEGORY */}
          <div className="form-group">
            <label htmlFor="event-subcategory">
              Alakategoria
              <span className="required"> *</span>
            </label>

            <select
              id="event-subcategory"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
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
            <label htmlFor="event-description">
              Kuvaus
              <span className="required"> *</span>
            </label>

            <textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

          {/* DATE AND TIME */}
          <div className="event-date">
            <div className="event-time-section">
              <h3>
                Aika
                <span className="required"> *</span>
              </h3>

              <div className="event-time-grid">
                {/* START */}
                <div className="time-block">
                  <label htmlFor="event-date">Alkaa</label>

                  <div className="time-input-row">
                    <input
                      id="event-date"
                      type="date"
                      value={date}
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        setDate(selectedDate);

                        if (!endDate || endDate < selectedDate) {
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
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* END */}
                <div className="time-block">
                  <label htmlFor="event-end-date">Päättyy</label>

                  <div className="time-input-row">
                    <input
                      id="event-end-date"
                      type="date"
                      min={date || undefined}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />

                    <input
                      id="event-end-time"
                      aria-label="Päättymisaika"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
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
            {loading ? "Tallennetaan..." : "⊕ Luo tapahtuma"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default CreateEvent;
