import { useState } from "react";

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

export default function App() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Kesäfestarit 🎵",
      category: "Musiikki",
      description: "Musiikkia ja hyvää tunnelmaa!",
      location: "Helsinki",
      date: "2026-07-10",
    },
    {
      id: 2,
      title: "Pelailuilta 🎮",
      category: "Pelit",
      description: "Tule pelaamaan ja tutustumaan uusiin ihmisiin.",
      location: "Espoo",
      date: "2026-11-05",
    },
    {
      id: 3,
      title: "Kahvittelu ☕",
      category: "Sosiaaliset tapahtumat",
      description: "Rento tapaaminen uusien tuttavuuksien kanssa.",
      location: "Vantaa",
      date: "2026-11-12",
    },
  ]);

  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("home");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = events.filter((event) =>
    `${event.title} ${event.description} ${event.category} ${event.location}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  function toggleFavorite(event) {
    setFavorites((current) =>
      current.some((item) => item.id === event.id)
        ? current.filter((item) => item.id !== event.id)
        : [...current, event],
    );
  }

  function createEvent(newEvent) {
    setEvents((current) => [...current, { ...newEvent, id: Date.now() }]);
    setPage("events");
  }

  return (
    <div className="app">
      <Navbar page={page} setPage={setPage} />

      <main>
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
          <EventDetails event={selectedEvent} setPage={setPage} />
        )}

        {page === "favorites" && <Favorites favorites={favorites} />}

        {page === "profile" && <Profile />}

        {page === "contact" && <Contact />}
      </main>

      <Footer />
    </div>
  );
}
