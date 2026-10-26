import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Yleinen kysymys",
    message: "",
  });

  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return;
    }

    setSent(true);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSent(false);
  }

  return (
    <main className="page contact-page">
      <h1>✉️ Ota yhteyttä</h1>
      <p>Onko sinulla kysyttävää tai palautetta? Lähetä meille viesti!</p>

      {sent ? (
        <div className="contact-success">
          <h2>Kiitos viestistäsi! 💜</h2>
          <p>Lomake on täytetty onnistuneesti.</p>
          <p>Huom! Tämä demo ei vielä lähetä viestiä oikeaan sähköpostiin.</p>
          <button onClick={() => setSent(false)}>Lähetä uusi viesti</button>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Nimi</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nimesi"
            required
          />

          <label htmlFor="email">Sähköposti</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="sinä@example.com"
            required
          />

          <label htmlFor="subject">Aihe</label>
          <select
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
          >
            <option>Yleinen kysymys</option>
            <option>Ongelma sovelluksessa</option>
            <option>Tapahtumaan liittyvä kysymys</option>
            <option>Palaute</option>
          </select>

          <label htmlFor="message">Viesti</label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Kirjoita viestisi tähän..."
            rows={5}
            required
          />

          <button type="submit">Lähetä viesti 💌</button>
        </form>
      )}
    </main>
  );
}
