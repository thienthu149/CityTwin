import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { X, Lock, ExternalLink, FileText, Check, QrCode } from 'lucide-react';

export type ModalKind = 'signin' | 'partnership' | 'external' | 'report';

interface ModalProps {
  kind: ModalKind;
  onClose: () => void;
}

function Shell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="glass-strong relative w-[440px] max-w-[92vw] rounded-3xl p-6"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Modal({ kind, onClose }: ModalProps) {
  if (kind === 'signin') {
    return (
      <Shell onClose={onClose}>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#5BA8FF]/15">
          <Lock className="h-5 w-5 text-[#5BA8FF]" />
        </span>
        <h2 className="font-display mt-4 text-2xl font-bold text-white">Pilot access only</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          No account required for demo. City Twin is being piloted with Hong Kong talent and
          partner organizations. During the hackathon there is nothing to log into — just
          explore the live demo.
        </p>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-white py-2.5 text-sm font-semibold text-[#070a18] transition hover:bg-white/90"
        >
          Continue to demo
        </button>
      </Shell>
    );
  }

  if (kind === 'external') {
    return (
      <Shell onClose={onClose}>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFC94D]/15">
          <ExternalLink className="h-5 w-5 text-[#FFC94D]" />
        </span>
        <h2 className="font-display mt-4 text-2xl font-bold text-white">External link placeholder</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          In production this opens the partner’s real application page. For the hackathon demo,
          outbound links are simulated so nothing leaves this prototype.
        </p>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-white py-2.5 text-sm font-semibold text-[#070a18] transition hover:bg-white/90"
        >
          Got it
        </button>
      </Shell>
    );
  }

  if (kind === 'report') {
    return (
      <Shell onClose={onClose}>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#2BD9A8]/15">
          <FileText className="h-5 w-5 text-[#2BD9A8]" />
        </span>
        <h2 className="font-display mt-4 text-2xl font-bold text-white">Pilot report</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          The pilot report will be generated after the first 100 users. It will include
          anonymized talent needs, integration-score movement, and partner-relevance insights.
        </p>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-white py-2.5 text-sm font-semibold text-[#070a18] transition hover:bg-white/90"
        >
          Close
        </button>
      </Shell>
    );
  }

  return <PartnershipModal onClose={onClose} />;
}

function PartnershipModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');
  const [focus, setFocus] = useState('Mixed talent pilot');

  if (submitted) {
    return (
      <Shell onClose={onClose}>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#2BD9A8]/15">
          <Check className="h-6 w-6 text-[#2BD9A8]" />
        </span>
        <h2 className="font-display mt-4 text-2xl font-bold text-white">Pilot request received</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          For the hackathon demo, this form is simulated — nothing is sent or stored. In
          production we’d follow up to scope a 100-user pilot for <span className="text-white">{org || 'your organization'}</span>.
        </p>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-white py-2.5 text-sm font-semibold text-[#070a18] transition hover:bg-white/90"
        >
          Done
        </button>
      </Shell>
    );
  }

  return (
    <Shell onClose={onClose}>
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#5BA8FF]/15">
        <QrCode className="h-5 w-5 text-[#5BA8FF]" />
      </span>
      <h2 className="font-display mt-4 text-2xl font-bold text-white">Start a 100-user Hong Kong pilot</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/70">
        City Twin can be tested immediately with international talent connected to Hong Kong.
        No system integration. No app download. Just a QR code.
      </p>

      <form
        className="mt-5 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div>
          <label className="font-mono-label text-[9px] text-white/45">Organization name</label>
          <input
            required
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            placeholder="e.g. Cyberport"
            className="mt-1 w-full rounded-xl border border-white/12 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-[#5BA8FF]/60 focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono-label text-[9px] text-white/45">Contact email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@org.hk"
            className="mt-1 w-full rounded-xl border border-white/12 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-[#5BA8FF]/60 focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono-label text-[9px] text-white/45">Pilot focus</label>
          <select
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/12 bg-white/[0.04] px-3 py-2.5 text-sm text-white focus:border-[#5BA8FF]/60 focus:outline-none [&>option]:bg-[#0b1126]"
          >
            <option>Students</option>
            <option>Founders</option>
            <option>Researchers</option>
            <option>Skilled professionals</option>
            <option>Mixed talent pilot</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-1 w-full rounded-xl bg-gradient-to-r from-[#5BA8FF] to-[#B98CFF] py-2.5 text-sm font-semibold text-[#070a18] transition hover:opacity-95"
        >
          Request pilot
        </button>
      </form>
    </Shell>
  );
}
