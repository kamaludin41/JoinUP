import { useState, useEffect } from "react";
import "./Profile.css";

const API_URL = "http://localhost:3001/api";

export default function Profile({ currentUser, token, onUserUpdate }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setMessage("Kirjaudu sisään nähdäksesi profiilisi.");
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Profiilin hakeminen epäonnistui.");
        }

        setName(data.user.name || "");
        onUserUpdate?.(data.user);
      } catch (err) {
        setMessage(err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token]);

  async function handleSave(e) {
    e.preventDefault();

    if (!currentUser?.id || !token) {
      setMessage("Kirjaudu sisään ennen tallentamista.");
      setError(true);
      return;
    }

    setSaving(true);
    setMessage("");
    setError(false);

    try {
      const response = await fetch(`${API_URL}/users/${currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Tallennus epäonnistui.");
      }

      onUserUpdate?.(data.user);
      setMessage("Profiilisi on tallennettu onnistuneesti!");
    } catch (err) {
      setMessage(err.message || "Tallennus epäonnistui.");
      setError(true);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="page profile-page">
        <div className="profile-loading">Ladataan profiiliasi...</div>
      </main>
    );
  }

  const initial = (name || currentUser?.name || "J")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <main className="page profile-page">
      <div className="profile-container">
        <header className="profile-heading">
          <h1>Oma profiili</h1>
        </header>

        <section className="profile-card">
          <div className="profile-cover">
            <span>💜</span>
          </div>

          <div className="profile-user">
            <div className="profile-avatar">{initial}</div>

            <div className="profile-user-info">
              <h2>{name || "Uusi käyttäjä"}</h2>
              <p>{currentUser?.email || "JoinUP-käyttäjä"}</p>
            </div>

            <span className="profile-status">● Aktiivinen</span>
          </div>

          <form className="profile-form" onSubmit={handleSave}>
            <div className="profile-section-title">
              <h3>Henkilötiedot</h3>
            </div>

            <div className="profile-field">
              <label htmlFor="profile-name">Nimi</label>
              <input
                id="profile-name"
                type="text"
                placeholder="Kirjoita nimesi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="profile-field">
              <label htmlFor="profile-email">Sähköposti</label>
              <input
                id="profile-email"
                type="email"
                value={currentUser?.email || ""}
                disabled
              />
              <small>Sähköpostia ei voi muuttaa tällä sivulla.</small>
            </div>

            {message && (
              <div
                className={`profile-message ${
                  error ? "profile-message-error" : "profile-message-success"
                }`}
                role="status"
                aria-live="polite"
              >
                {message}
              </div>
            )}

            <div className="profile-actions">
              <button type="submit" disabled={saving}>
                {saving ? "Tallennetaan..." : "Tallenna muutokset"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
