function Navbar({ page, setPage }) {
  return (
    <nav className="navbar">
      <h2 className="logo" onClick={() => setPage("home")}>
        JoinUP
      </h2>

      <div className="nav-links">
        <button onClick={() => setPage("home")}>Etusivu</button>
        <button onClick={() => setPage("events")}>Tapahtumat</button>
        <button onClick={() => setPage("create")}>+ Luo tapahtuma</button>
      </div>
    </nav>
  );
}

export default Navbar;
