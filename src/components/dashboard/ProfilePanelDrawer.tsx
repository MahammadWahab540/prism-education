import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfilePanel } from '@/contexts/ProfilePanelContext';
import { X } from 'lucide-react';

const RightProfilePanelLazy = React.lazy(() => import('./RightProfilePanel').then(m => ({ default: m.RightProfilePanel })));

export function ProfilePanelDrawer() {
  const { open, closePanel } = useProfilePanel();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    if (open) {
      document.addEventListener('keydown', onKey);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // focus first focusable
      setTimeout(() => {
        const container = panelRef.current;
        if (!container) return;
        const focusable = container.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      }, 0);
      return () => {
        document.removeEventListener('keydown', onKey);
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [open, closePanel]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden
            onClick={closePanel}
          />

          {/* Drawer */}
          <motion.div
            ref={panelRef}
            className="fixed left-0 top-0 h-screen w-full sm:w-[320px] max-w-[90vw] z-50 bg-background shadow-2xl border-r"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-panel-title"
            initial={{ x: -360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -360, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 id="profile-panel-title" className="text-sm font-medium">Profile</h2>
              <button
                aria-label="Close profile panel"
                className="p-2 rounded hover:bg-muted"
                onClick={closePanel}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="h-[calc(100vh-49px)] overflow-y-auto">
              <React.Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading...</div>}>
                <RightProfilePanelLazy />
              </React.Suspense>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

