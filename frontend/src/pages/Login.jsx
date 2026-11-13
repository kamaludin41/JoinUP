import { useState } from "react";
import "./Login.css";

const API_URL = "http://localhost:3001/api";

export default function Login({ onLogin, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kirjautuminen epäonnistui.");
      }

      if (!data.token) {
        throw new Error("Backend ei palauttanut kirjautumistunnusta.");
      }

      onLogin(data.token);
      setPage("home");
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
          <h1>Kirjaudu JoinUP</h1>
        </div>

        <div className="login-card">
          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-field">
              <label htmlFor="login-email">Sähköposti</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Sähköpostisi"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Salasana</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Salasanasi"
                required
              />
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Kirjaudutaan..." : "Kirjaudu sisään"}
            </button>

            <p className="login-register">
              Eikö sinulla ole vielä tiliä?{" "}
              <button type="button" onClick={() => setPage("register")}>
                Rekisteröidy
              </button>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
