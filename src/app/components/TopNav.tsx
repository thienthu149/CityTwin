import { Sparkles } from 'lucide-react';

interface TopNavProps {
  onForOrganizations: () => void;
  onSignIn: () => void;
  onLogIn: () => void;
  onLogo: () => void;
}

export function TopNav({ onForOrganizations, onSignIn, onLogIn, onLogo }: TopNavProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/[0.06] bg-[#05070f]/70 px-5 py-3.5 backdrop-blur-md md:px-8">
      <button onClick={onLogo} className="flex items-center gap-2.5 text-left">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#5BA8FF] to-[#B98CFF]">
          <Sparkles className="h-5 w-5 text-[#070a18]" />
        </span>
        <span>
          <span className="font-display block text-lg font-bold leading-none text-white">City Twin</span>
          <span className="font-mono-label text-[9px] text-white/45">Hong Kong · Human Layer</span>
        </span>
      </button>

      <nav className="flex items-center gap-1.5">
        <button
          onClick={onForOrganizations}
          className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-white/85 transition hover:bg-white/10"
        >
          For organizations
        </button>
        <button
          onClick={onSignIn}
          className="hidden rounded-full px-3.5 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/10 sm:block"
        >
          Sign in
        </button>
        <button
          onClick={onLogIn}
          className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-[#070a18] transition hover:bg-white/90"
        >
          Log in
        </button>
      </nav>
    </header>
  );
}
