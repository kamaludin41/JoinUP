import { useState } from "react";

function CreateEvent({ onCreate, setPage }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Viihde");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    onCreate({
      id: Date.now(),
      title,
      category,
      description,
      location,
      date,
      time,
      emoji: "🎉",
    });

    setPage("events");
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
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
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

        <button type="submit">Luo tapahtuma</button>
      </form>
    </main>
  );
}

export default CreateEvent;
