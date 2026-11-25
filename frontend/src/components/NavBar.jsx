function Navbar({ page, setPage, currentUser, onLogout }) {
  return (
    <nav className="navbar">
      <h2 className="logo" onClick={() => setPage("home")}>
        JoinUP
      </h2>

      <div className="nav-links">
        <button onClick={() => setPage("home")}>Etusivu</button>
        <button onClick={() => setPage("events")}>Tapahtumat</button>

        {currentUser ? (
          <>
            <button onClick={() => setPage("create")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="20"
                viewBox="596 0 128 120"
              >
                <path
                  fill="currentColor"
                  d="M723.84 63.93C688.46 64.19 660 35.73 660 .62c0 35.11-28.46 63.57-63.57 63.57h0c35.11 0 63.57 28.46 63.57 63.57h0c0-35.11 28.46-63.57 63.57-63.57z"
                />
              </svg>
              Luo tapahtuma
            </button>
            <button onClick={() => setPage("myevents")}>
              Omat ilmoittautumiset
            </button>
            <button onClick={onLogout}>Kirjaudu ulos</button>
            <button onClick={() => setPage("profile")}>👤 Profiili</button>
          </>
        ) : (
          <>
            <button onClick={() => setPage("login")}>Kirjaudu sisään</button>
            <button onClick={() => setPage("register")}>Rekisteröidy</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
