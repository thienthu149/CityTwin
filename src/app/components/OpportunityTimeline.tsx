import { motion } from 'motion/react';
import { Calendar, MapPin, Users, Award, Briefcase, Globe, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TimelineEvent {
  id: string;
  name: string;
  category: string;
  details: string;
  month: string;
  link: string;
}

interface DatabaseData {
  hong_kong_ecosystem: {
    funding: TimelineEvent[];
    education: TimelineEvent[];
    expats: TimelineEvent[];
    founders: TimelineEvent[];
    study: TimelineEvent[];
  };
}

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('funding') || cat.includes('grant')) return Award;
  if (cat.includes('education') || cat.includes('study')) return Globe;
  if (cat.includes('expat') || cat.includes('community')) return Users;
  if (cat.includes('founder') || cat.includes('entrepreneur')) return Briefcase;
  return Calendar;
};

const getCategoryColor = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('funding') || cat.includes('grant')) return '#f59e0b';
  if (cat.includes('education') || cat.includes('study')) return '#10b981';
  if (cat.includes('expat') || cat.includes('community')) return '#ec4899';
  if (cat.includes('founder') || cat.includes('entrepreneur')) return '#8b5cf6';
  return '#06b6d4';
};

export function OpportunityTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    // Load data from database.json
    fetch('/database.json')
      .then(res => res.json())
      .then((data: DatabaseData) => {
        // Combine all categories
        const allEvents = [
          ...data.hong_kong_ecosystem.funding,
          ...data.hong_kong_ecosystem.education,
          ...data.hong_kong_ecosystem.expats,
          ...data.hong_kong_ecosystem.founders,
          ...data.hong_kong_ecosystem.study,
        ];
        
        // Sort by month (simple alphabetical for now)
        const sorted = allEvents.sort((a, b) => a.month.localeCompare(b.month));
        
        setEvents(sorted);
      })
      .catch(err => console.error('Failed to load database:', err));
  }, []);

  return (
    <div className="h-full bg-[#0a0e27] overflow-hidden flex flex-col">
      <div className="p-4 bg-[#0f1729] border-b border-white/10">
        <h2 className="text-white">Suggested Schedule</h2>
        <p className="text-gray-400" style={{ fontSize: '0.875rem' }}>
          Upcoming opportunities in Hong Kong
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="relative max-w-2xl mx-auto">
          {/* Timeline vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500 opacity-30" />

          {/* Timeline events */}
          <div className="space-y-8">
            {events.map((event, index) => {
              const Icon = getCategoryIcon(event.category);
              const color = getCategoryColor(event.category);
              
              return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative flex gap-4"
              >
                {/* Timeline dot */}
                <div className="relative flex-shrink-0 mt-1">
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center relative z-10"
                    style={{
                      backgroundColor: `${color}40`,
                      boxShadow: `0 0 20px ${color}60`
                    }}
                    whileHover={{ scale: 1.1 }}
                    animate={{
                      boxShadow: [
                        `0 0 20px ${color}60`,
                        `0 0 30px ${color}80`,
                        `0 0 20px ${color}60`
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: color }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </motion.div>

                  {/* Connecting line to card */}
                  <div
                    className="absolute top-6 left-12 w-4 h-0.5"
                    style={{
                      backgroundColor: color,
                      opacity: 0.4
                    }}
                  />
                </div>

                {/* Event card */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 p-4 rounded-2xl border-2 bg-[#1a1f3a] shadow-sm active:shadow-md transition-shadow"
                  style={{
                    borderColor: `${color}60`,
                    boxShadow: `0 0 20px ${color}20`
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="px-3 py-1 rounded-lg text-white"
                      style={{
                        backgroundColor: color,
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        boxShadow: `0 0 10px ${color}50`
                      }}
                    >
                      {event.category}
                    </span>
                  </div>

                  <h4 className="text-white mb-3" style={{ fontSize: '1rem', fontWeight: '600' }}>
                    {event.name}
                  </h4>

                  <p className="text-gray-400 mb-4" style={{ fontSize: '0.875rem' }}>
                    {event.details}
                  </p>

                  <div className="space-y-2 text-gray-400 mb-4" style={{ fontSize: '0.875rem' }}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{event.month}</span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.open(event.link, '_blank')}
                    className="w-full py-2.5 rounded-xl text-white text-sm font-medium shadow-sm active:shadow-md transition-all flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 15px ${color}50`
                    }}
                  >
                    <span>Learn More</span>
                    <ExternalLink className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </motion.div>
              );
            })}
          </div>

          {/* Timeline end indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: events.length * 0.1 + 0.3 }}
            className="relative flex justify-start mt-8 ml-6"
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ boxShadow: '0 0 15px rgba(168, 85, 247, 0.6)' }} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
