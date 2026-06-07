import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import './citytwin.css';
import { TopNav } from './components/TopNav';
import { Home } from './views/Home';
import { TalentExperience } from './views/TalentExperience';
import { Organizations } from './views/Organizations';
import { Modal, type ModalKind } from './components/Modals';

type View = 'home' | 'experience' | 'organizations';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [modal, setModal] = useState<ModalKind | null>(null);

  const goHome = () => {
    setView('home');
    window.scrollTo({ top: 0 });
  };
  const goExperience = () => {
    setView('experience');
    window.scrollTo({ top: 0 });
  };
  const goOrganizations = () => {
    setView('organizations');
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#05070f] text-white">
      <TopNav
        onForOrganizations={goOrganizations}
        onSignIn={() => setModal('signin')}
        onLogIn={() => setModal('signin')}
        onLogo={goHome}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {view === 'home' && <Home onEnterHongKong={goExperience} />}
          {view === 'experience' && <TalentExperience />}
          {view === 'organizations' && (
            <Organizations
              onRequestPartnership={() => setModal('partnership')}
              onDownloadReport={() => setModal('report')}
              onBackToTalent={goExperience}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>{modal && <Modal kind={modal} onClose={() => setModal(null)} />}</AnimatePresence>
    </div>
  );
}
