import { motion } from 'motion/react';
import { Calendar, MapPin, Users, Award, Briefcase, Globe } from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  location: string;
  category: 'community' | 'scholarship' | 'grant' | 'entrepreneurship' | 'culture';
  icon: any;
  color: string;
}

const events: TimelineEvent[] = [
  {
    id: '1',
    date: 'Jun 10',
    time: '6:00 PM',
    title: 'Hong Kong Tech Startup Meetup',
    location: 'Cyberport, Hong Kong',
    category: 'community',
    icon: Users,
    color: '#ec4899',
  },
  {
    id: '2',
    date: 'Jun 15',
    time: '2:00 PM',
    title: 'Innovation Grant Workshop',
    location: 'Science Park, Hong Kong',
    category: 'grant',
    icon: Award,
    color: '#f59e0b',
  },
  {
    id: '3',
    date: 'Jun 18',
    time: '10:00 AM',
    title: 'Entrepreneur Pitch Competition',
    location: 'PMQ, Central',
    category: 'entrepreneurship',
    icon: Briefcase,
    color: '#8b5cf6',
  },
  {
    id: '4',
    date: 'Jun 22',
    time: '4:00 PM',
    title: 'International Scholarship Fair',
    location: 'Hong Kong Convention Centre',
    category: 'scholarship',
    icon: Globe,
    color: '#10b981',
  },
  {
    id: '5',
    date: 'Jun 25',
    time: '7:00 PM',
    title: 'Cultural Exchange Evening',
    location: 'West Kowloon Cultural District',
    category: 'culture',
    icon: Calendar,
    color: '#06b6d4',
  },
  {
    id: '6',
    date: 'Jun 28',
    time: '9:00 AM',
    title: 'Startup Incubator Demo Day',
    location: 'Garage Society, Wan Chai',
    category: 'entrepreneurship',
    icon: Briefcase,
    color: '#8b5cf6',
  },
];

export function OpportunityTimeline() {
  return (
    <div className="h-full bg-[#0a0e27] overflow-hidden flex flex-col">
      <div className="px-5 py-5 bg-[#0f1729] border-b border-white/10">
        <p className="text-white font-bold" style={{ fontSize: '1.6rem' }}>Suggested Schedule</p>
        <p className="text-gray-400 mt-1" style={{ fontSize: '0.9rem' }}>
          Upcoming opportunities in Hong Kong
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="relative max-w-2xl mx-auto">
          {/* Timeline vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500 opacity-30" />

          {/* Timeline events */}
          <div className="space-y-8">
            {events.map((event, index) => (
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
                      backgroundColor: `${event.color}40`,
                      boxShadow: `0 0 20px ${event.color}60`
                    }}
                    whileHover={{ scale: 1.1 }}
                    animate={{
                      boxShadow: [
                        `0 0 20px ${event.color}60`,
                        `0 0 30px ${event.color}80`,
                        `0 0 20px ${event.color}60`
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: event.color }}
                    >
                      <event.icon className="w-4 h-4 text-white" />
                    </div>
                  </motion.div>

                  {/* Connecting line to card */}
                  <div
                    className="absolute top-6 left-12 w-4 h-0.5"
                    style={{
                      backgroundColor: event.color,
                      opacity: 0.4
                    }}
                  />
                </div>

                {/* Event card */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 p-5 rounded-2xl border-2 bg-[#1a1f3a] shadow-sm active:shadow-md transition-shadow"
                  style={{
                    borderColor: `${event.color}60`,
                    boxShadow: `0 0 20px ${event.color}20`
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="px-4 py-1.5 rounded-full text-white"
                      style={{
                        backgroundColor: event.color,
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        boxShadow: `0 0 10px ${event.color}50`
                      }}
                    >
                      {event.category}
                    </span>
                  </div>

                  <h4 className="text-white mb-4" style={{ fontSize: '1.15rem', fontWeight: '700' }}>
                    {event.title}
                  </h4>

                  <div className="space-y-2.5 text-gray-400 mb-5" style={{ fontSize: '0.95rem' }}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>
                        {event.date} at {event.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-full text-white font-semibold shadow-sm active:shadow-md transition-all"
                    style={{
                      fontSize: '1rem',
                      backgroundColor: event.color,
                      boxShadow: `0 0 15px ${event.color}50`
                    }}
                  >
                    Add to Calendar
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
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
