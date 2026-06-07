import { motion } from 'motion/react';
import { useState } from 'react';
import { CityTwinLogo } from './CityTwinLogo';
import { ArrowLeft, Building2 } from 'lucide-react';

interface B2BFormProps {
  onBack: () => void;
}

export function B2BForm({ onBack }: B2BFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Funding',
    details: '',
    month: '',
    link: '',
    organizationName: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock submission - log to console
    console.log('B2B Form Submission (Mocked):', formData);
    console.log('This would be added to database.json in production');
    
    // Show success message
    setSubmitted(true);
    
    // Reset form after 3 seconds and go back
    setTimeout(() => {
      setSubmitted(false);
      onBack();
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="h-screen w-full bg-[#0a0e27] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Submission Successful!</h2>
          <p className="text-gray-400">Your opportunity has been submitted for review.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#0a0e27] overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <CityTwinLogo />
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#1a1f3a] rounded-3xl p-8 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-white text-2xl font-bold">B2B Partnership</h2>
              <p className="text-gray-400 text-sm">Create new opportunities for our community</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Name */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Organization Name *
              </label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0a0e27] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="e.g., Cyberport, HKUST"
              />
            </div>

            {/* Opportunity Name */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Opportunity Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0a0e27] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="e.g., Startup Incubation Programme"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0a0e27] border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="Funding">Funding</option>
                <option value="Education">Education</option>
                <option value="Expats">Expats</option>
                <option value="Founders">Founders</option>
                <option value="Study">Study</option>
                <option value="Social">Social</option>
              </select>
            </div>

            {/* Details */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Details *
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-[#0a0e27] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                placeholder="Describe the opportunity, benefits, and requirements..."
              />
            </div>

            {/* Month */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                When to start *
              </label>
              <input
                type="text"
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0a0e27] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="e.g., January, February"
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Website Link *
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0a0e27] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="https://..."
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}
            >
              Submit Opportunity
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
