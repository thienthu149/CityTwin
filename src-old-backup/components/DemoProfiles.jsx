export default function DemoProfiles({ demos, onSelect, onClear }) {
  return (
    <div className="demo-profiles">
      <span className="demo-label">Demo</span>
      {Object.entries(demos).map(([key, profile]) => (
        <button
          key={key}
          className={`demo-btn ${key}`}
          onClick={() => onSelect(key)}
          title={profile.message}
        >
          {profile.label}
        </button>
      ))}
      <button className="clear-btn" onClick={onClear} title="Clear conversation">
        ✕ Clear
      </button>
    </div>
  );
}
