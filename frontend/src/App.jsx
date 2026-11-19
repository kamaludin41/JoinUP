
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
import Login from "./pages/Login";
import Register from "./pages/Register";
import Myevents from "./pages/Myevents";

import "./index.css";
import "./App.css";

const API_URL = "http://localhost:3001/api";
const EVENTS_URL = `${API_URL}/events`;

export default function App() {
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("home");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [currentUser, setCurrentUser] = useState(null);

  // Logout
  function handleLogout() {
    localStorage.removeItem("token");
    setToken("");
    setCurrentUser(null);
    setPage("home");
  }

  // Hae tapahtumat backendistä
  async function loadEvents() {
    try {
      setError("");

      const response = await fetch(EVENTS_URL);

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
        "Tapahtumia ei voitu hakea. Tarkista, että backend toimii portissa 3001."
      );
    } finally {
      setLoading(false);
    }
  }

  // Hae tapahtumat, kun sivu avataan
  useEffect(() => {
    loadEvents();
  }, []);

  // Hae kirjautunut käyttäjä
  useEffect(() => {
    async function loadCurrentUser() {
      if (!token) {
        setCurrentUser(null);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("token");
          setToken("");
          setCurrentUser(null);
          return;
        }

        const data = await response.json();
        setCurrentUser(data.user);
      } catch (error) {
        console.error("Käyttäjän hakeminen epäonnistui:", error);
      }
    }

    loadCurrentUser();
  }, [token]);

  // Hae tapahtumia hakusanalla
  const filteredEvents = events.filter((event) =>
    `${event.title || ""} ${event.description || ""} ${
      event.category || ""
    } ${event.location || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Lisää tai poista suosikki
  function toggleFavorite(event) {
    setFavorites((current) =>
      current.some((item) => item.id === event.id)
        ? current.filter((item) => item.id !== event.id)
        : [...current, event]
    );
  }

  // Tallenna uusi tapahtuma backendin kautta
  async function createEvent(newEvent) {
    try {
      setError("");

      if (!token) {
        throw new Error(
          "Kirjaudu sisään ennen tapahtuman luomista."
        );
      }

      const response = await fetch(EVENTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Tapahtuman tallentaminen epäonnistui."
        );
      }

      await loadEvents();
      setPage("events");

      return data;
    } catch (err) {
      console.error("Tapahtuman luominen epäonnistui:", err);
      throw err;
    }
  }

  // Kirjautuminen
  function handleLogin(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  return (
    <div className="app">
      <Navbar
        page={page}
        setPage={setPage}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

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
            {page === "login" && (
              <Login
                onLogin={handleLogin}
                setPage={setPage}
              />
            )}

            {page === "register" && (
              <Register
                onLogin={handleLogin}
                setPage={setPage}
              />
            )}

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
            )}

            {page === "create" && (
              <CreateEvent
                onCreate={createEvent}
                setPage={setPage}
              />
            )}

            {page === "details" && selectedEvent && (
              <EventDetails
                event={selectedEvent}
                token={token}
                currentUser={currentUser}
                onBack={async () => {
                  await loadEvents();
                  setPage("events");
                }}
              />
            )}

            {page === "favorites" && (
              <Favorites favorites={favorites} />
            )}

            {page === "profile" && (
              <Profile
                currentUser={currentUser}
                token={token}
                onUserUpdate={setCurrentUser}
              />
            )}

            {page === "myevents" && (
              <Myevents token={token} />
            )}

            {page === "contact" && <Contact />}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
