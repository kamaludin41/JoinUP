import { useEffect, useState } from "react";
import { getEventEmoji } from "../utils/eventEmoji";
import "./Myevents.css";

const API_URL = "http://localhost:3001/api";

function Myevents({ token }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");

  function formatEventDate(dateString) {
    const date = new Date(dateString);

    return {
      day: date.getDate() + "." + (date.getMonth() + 1),
      weekday: date.toLocaleDateString("fi-FI", {
        weekday: "long",
      }),
    };
  }

  useEffect(() => {
    let cancelled = false;

    async function loadRegistrations() {
      if (!token) {
        setError("Kirjaudu sisään nähdäksesi ilmoittautumisesi.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/my-registrations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Tapahtumien hakeminen epäonnistui.");
        }

        if (!cancelled) {
          setRegistrations(data);
          setError("");
        }
      } catch (error) {
        if (!cancelled) {
          setError(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRegistrations();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // Today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Upcoming events
  const upcomingEvents = registrations.filter((registration) => {
    const eventDate = new Date(registration.event.date);
    return !isNaN(eventDate.getTime()) && eventDate >= today;
  });

  // Past events
  const pastEvents = registrations.filter((registration) => {
    const eventDate = new Date(registration.event.date);
    return !isNaN(eventDate.getTime()) && eventDate < today;
  });

  // Events displayed in selected tab
  const displayedEvents =
    activeTab === "upcoming" ? upcomingEvents : pastEvents;
  const groupedEvents = displayedEvents.reduce((groups, registration) => {
    const date = registration.event.date;

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(registration);

    return groups;
  }, {});

  const sortedDates = Object.keys(groupedEvents).sort((a, b) => {
    return activeTab === "upcoming"
      ? new Date(a) - new Date(b)
      : new Date(b) - new Date(a);
  });

  if (loading) {
    return (
      <main className="container section my-events-page">
        Ladataan ilmoittautumisia...
      </main>
    );
  }

  return (
    <main className="container section my-events-page">
      <h1>My Events</h1>
      <p>Tapahtumat, joihin olet ilmoittautunut.</p>

      {error && <p role="alert">{error}</p>}

      <div className="my-events-tabs">
        <button
          className={activeTab === "upcoming" ? "active" : ""}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming {upcomingEvents.upcoming}
        </button>

        <button
          className={activeTab === "past" ? "active" : ""}
          onClick={() => setActiveTab("past")}
        >
          Past {pastEvents.past}
        </button>
      </div>

      {!error && registrations.length === 0 && (
        <p>Et ole vielä ilmoittautunut yhteenkään tapahtumaan.</p>
      )}

      {!error && registrations.length > 0 && displayedEvents.length === 0 && (
        <p>
          {activeTab === "upcoming"
            ? "Ei tulevia tapahtumia."
            : "Ei menneitä tapahtumia."}
        </p>
      )}

      <div className="events-by-date">
        {sortedDates.map((date) => {
          const formatted = formatEventDate(date);

          return (
            <section className="event-date-group" key={date}>
              <div className="event-date-heading">
                <h2>{formatted.day}</h2>
                <p>{formatted.weekday}</p>
              </div>

              <div className="events-grid">
                {groupedEvents[date].map((registration) => {
                  const event = registration.event;

                  if (!event) return null;

                  return (
                    <article className="event-card" key={registration.id}>
                      <div className="event-emoji">{getEventEmoji(event)}</div>

                      <h2>{event.title}</h2>
                      <p>{event.description}</p>
                      <p>📍 {event.location}</p>
                      <p>🕒 {event.time}</p>

                      <p>
                        {activeTab === "upcoming"
                          ? "✓ Olet ilmoittautunut tähän tapahtumaan"
                          : "✓ Tapahtuma on päättynyt"}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

export default Myevents;
