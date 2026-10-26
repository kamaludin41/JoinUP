import EventCard from "../components/EventCard";

function Home({ events, onSelect, setPage }) {
  return (
    <main className="container">
      <section className="hero">
        <p className="eyebrow">Löydä oma porukkasi</p>
        <h1>
          Löydä tapahtumia.
          <br />
          Tutustu uusiin ihmisiin.
        </h1>
        <p>
          JoinUP auttaa sinua löytämään kiinnostavaa tekemistä ja tapaamaan
          muita opiskelijoita.
        </p>
        <button onClick={() => setPage("events")}>Tutustu tapahtumiin →</button>
      </section>

      <section className="section">
        <h2>Tulevat tapahtumat</h2>
        <p>Löydä seuraava suosikkitapahtumasi.</p>

        <div className="event-grid">
          {events.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} onSelect={onSelect} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
