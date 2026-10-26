export default function SearchBar({ search, setSearch }) {
  return (
    <div className="search-bar">
      <span>🔍</span>
      <input
        type="text"
        placeholder="Etsi tapahtumia..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
