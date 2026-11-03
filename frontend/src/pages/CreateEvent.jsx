import { useState } from "react";
function CreateEvent({ onCreate, setPage }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Viihde");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 async function handleSubmit(e) {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    await onCreate({
      title,
      category,
      description,
      location,
      date,
      time,
      emoji: "🎉",
    });
    setPage("events");
  } catch (err) {
    setError(err.message || "Could not create event.");
  } finally {
    setLoading(false);
  }
 }
 return (
    <main className="container section">
      <h1>Luo uusi tapahtuma</h1>
      <p>Kerro muille, mitä olet järjestämässä.</p>

      <form className="event-form" onSubmit={handleSubmit}>
        <label>Tapahtuman nimi</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Esim. Lautapeli-ilta"
          required
        />

        <label>Kategoria</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Viihde</option>
          <option>Koulutus</option>
          <option>Teknologia</option>
          <option>Urheilu</option>
          <option>Ura</option>
          <option>Vapaa-aika</option>
        </select>

        <label>Kuvaus</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mitä tapahtumassa tehdään?"
          required
        />

        <label>Paikka</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Esim. Koulun oleskelutila"
          required
        />

        <label>Päivämäärä</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label>Aika</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Tallennetaan..." : "Luo tapahtuma"}
        </button>
      </form>
    </main>
  );
}

export default CreateEvent;
