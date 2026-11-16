
export default function SearchBar({ search, setSearch }) {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        placeholder="Etsi tapahtumia..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <button
          type="button"
          className="clear-search"
          onClick={() => setSearch("")}
          aria-label="Tyhjennä haku"
        >
          ×
        </button>
      )}
    </div>
  );
}
