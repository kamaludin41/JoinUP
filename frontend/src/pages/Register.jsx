import { useState } from "react";
import "./Login.css";

const API_URL = "http://localhost:3001/api";

export default function Register({ onLogin, setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Rekisteröityminen epäonnistui.");
      }

      // Kirjaudutaan sisään rekisteröitymisen jälkeen.
      if (data.token) {
        onLogin(data.token);
        setPage("home");
      } else {
        setPage("login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-container">
        <div className="login-heading">
          <h1>Luo JoinUP-tili</h1>
          <p>Liity mukaan ja löydä kiinnostavia tapahtumia!</p>
        </div>

        <div className="login-card">
          <form className="login-form" onSubmit={handleRegister}>
            <div className="login-field">
              <label htmlFor="register-name">Nimi</label>
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Kirjoita nimesi"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="register-email">Sähköposti</label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Kirjoita sähköpostisi"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="register-password">Salasana</label>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Luo salasana"
                minLength={8}
                required
              />
              <small>Salasanan tulee olla vähintään 8 merkkiä.</small>
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Luodaan tiliä..." : "Rekisteröidy"}
            </button>

            <p className="login-register">
              Onko sinulla jo tili?{" "}
              <button type="button" onClick={() => setPage("login")}>
                Kirjaudu sisään
              </button>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
