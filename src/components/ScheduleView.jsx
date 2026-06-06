const COLORS = {
  community:        '#e91e8c',
  grant:            '#ff9800',
  entrepreneurship: '#9c27b0',
  scholarship:      '#4caf50',
  education:        '#4488ff',
  culture:          '#00bcd4',
};

const GRADIENTS = {
  community:        'linear-gradient(135deg, #e91e8c, #c2185b)',
  grant:            'linear-gradient(135deg, #ff9800, #e65100)',
  entrepreneurship: 'linear-gradient(135deg, #9c27b0, #6a1b9a)',
  scholarship:      'linear-gradient(135deg, #4caf50, #2e7d32)',
  education:        'linear-gradient(135deg, #4488ff, #1a56cc)',
  culture:          'linear-gradient(135deg, #00bcd4, #00838f)',
};

const EVENTS = [
  { category: 'community',       title: 'Hong Kong Tech Startup Meetup',  date: 'Jun 10 at 6:00 PM',  location: 'Cyberport, Hong Kong' },
  { category: 'grant',           title: 'Innovation Grant Workshop',       date: 'Jun 15 at 2:00 PM',  location: 'Science Park, Hong Kong' },
  { category: 'entrepreneurship',title: 'Entrepreneur Pitch Competition',  date: 'Jun 18 at 10:00 AM', location: 'PMQ, Central' },
  { category: 'scholarship',     title: 'Scholarship Information Day',     date: 'Jun 22 at 1:00 PM',  location: 'HKUST, Clear Water Bay' },
];

export default function ScheduleView() {
  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      <div className="px-5 pt-5 pb-28">
        {EVENTS.map((ev, i) => {
          const color = COLORS[ev.category] || '#888';
          const gradient = GRADIENTS[ev.category] || color;
          return (
            <div key={i} className="flex gap-4 items-stretch">

              {/* Timeline column: icon + vertical connector */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 mt-5"
                  style={{ background: gradient, boxShadow: `0 4px 18px ${color}55` }}
                >
                  <CategoryIcon type={ev.category} />
                </div>
                {i < EVENTS.length - 1 && (
                  <div
                    className="w-px my-2"
                    style={{
                      flex: 1,
                      minHeight: 28,
                      background: 'linear-gradient(to bottom, rgba(156,39,176,0.45), rgba(156,39,176,0.06))',
                    }}
                  />
                )}
              </div>

              {/* Event card */}
              <div
                className="flex-1 flex flex-col gap-3 rounded-2xl p-5 mt-3 mb-5"
                style={{
                  border: `1px solid ${color}50`,
                  background: 'rgba(11, 19, 46, 0.9)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                {/* Category badge */}
                <span
                  className="inline-flex items-center px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase w-fit"
                  style={{ background: `${color}25`, color, border: `1px solid ${color}45` }}
                >
                  {ev.category}
                </span>

                {/* Title */}
                <h3 className="text-[17px] font-bold text-white leading-snug tracking-tight">
                  {ev.title}
                </h3>

                {/* Date & location */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5 text-[13px]" style={{ color: '#6b7a99' }}>
                    <CalIcon color={color} />
                    <span>{ev.date}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px]" style={{ color: '#6b7a99' }}>
                    <PinIcon color={color} />
                    <span>{ev.location}</span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  className="w-full py-3.5 rounded-2xl text-white text-sm font-bold tracking-wide transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                  style={{ background: gradient, boxShadow: `0 4px 14px ${color}44` }}
                >
                  Add to Calendar
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

function CategoryIcon({ type }) {
  const props = { width: 18, height: 18, fill: 'white' };
  switch (type) {
    case 'community':
      return <svg {...props} viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
    case 'grant':
      return <svg {...props} viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>;
    case 'entrepreneurship':
      return <svg {...props} viewBox="0 0 24 24"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.35C18 2.55 15.45 1 12 1 8.55 1 6 2.55 6 4.65c0 .47.11.91.18 1.35H4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM4 20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7H4v7z"/></svg>;
    case 'scholarship':
      return <svg {...props} viewBox="0 0 24 24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>;
    default:
      return null;
  }
}

function CalIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function PinIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
