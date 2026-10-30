import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";

import "./index.css";

const API_URL = "http://localhost:3001/api/events";
const REGISTRATION_API_URL = "http://localhost:3001/api/registrations";
const USER_API_URL = "http://localhost:3001/api/users";

export default function App() {
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("home");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Hae tapahtumat backendistä
  async function loadEvents() {
    try {
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Tapahtumien hakeminen epäonnistui.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Backend palautti virheelliset tapahtumatiedot.");
      }

      setEvents(data);
    } catch (err) {
      console.error("Tapahtumien haku epäonnistui:", err);
      setError(
        "Tapahtumia ei voitu hakea. Tarkista, että backend toimii portissa 3001.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  // Hae tapahtumia hakusanalla
  const filteredEvents = events.filter((event) =>
    `${event.title || ""} ${event.description || ""} ${
      event.category || ""
    } ${event.location || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // Lisää tai poista suosikki
  function toggleFavorite(event) {
    setFavorites((current) =>
      current.some((item) => item.id === event.id)
        ? current.filter((item) => item.id !== event.id)
        : [...current, event],
    );
  }

  // Tallenna uusi tapahtuma backendin kautta
  async function createEvent(newEvent) {
    try {
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Tapahtuman tallentaminen epäonnistui.");
      }

      await loadEvents();
      setPage("events");
    } catch (err) {
      console.error("Tapahtuman luominen epäonnistui:", err);
      setError(err.message || "Tapahtuman tallentaminen epäonnistui.");
    }
  }

  return (
    <div className="app">
      <Navbar page={page} setPage={setPage} />

      {error && (
        <div className="container section" role="alert">
          <p>{error}</p>
          <button type="button" onClick={loadEvents}>
            Yritä uudelleen
          </button>
        </div>
      )}

      <main>
        {loading ? (
          <div className="container section">
            <p>Ladataan tapahtumia...</p>
          </div>
        ) : (
          <>
            {page === "home" && (
              <Home
                events={filteredEvents}
                setPage={setPage}
                setSelectedEvent={setSelectedEvent}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            )}

            {page === "events" && (
              <>
                <SearchBar search={search} setSearch={setSearch} />
                <Events
                  events={filteredEvents}
                  onSelect={(event) => {
                    setSelectedEvent(event);
                    setPage("details");
                  }}
                  setSelectedEvent={setSelectedEvent}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              </>
            )}

            {page === "create" && (
              <CreateEvent onCreate={createEvent} setPage={setPage} />
            )}

            {page === "details" && selectedEvent && (
              <EventDetails
                event={selectedEvent}
                onBack={() => setPage("events")}
              />
            )}

            {page === "favorites" && <Favorites favorites={favorites} />}

            {page === "profile" && <Profile />}

            {page === "contact" && <Contact />}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
