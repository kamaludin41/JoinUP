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
            <button onClick={() => setPage("profile")}>👤 Profiili</button>
            <button onClick={onLogout}>Kirjaudu ulos</button>
            <button onClick={() => setPage("create")}>+ Luo tapahtuma</button>
            <button onClick={() => setPage("myevents")}>
              Omat ilmoittautumiset
            </button>
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
