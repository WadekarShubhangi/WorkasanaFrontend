export default function SearchBox({ query, setQuery }) {
  return (
    <div className="search-container mb-4">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search projects or tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
      </div>
    </div>
  );
}
