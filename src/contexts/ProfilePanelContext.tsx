import React, { createContext, useContext, useMemo, useState } from 'react';

type Section = 'overview' | 'learningHistory' | 'accountSettings' | string;

type Ctx = {
  open: boolean;
  section: Section;
  openPanel: (s?: Section) => void;
  closePanel: () => void;
};

const ProfilePanelContext = createContext<Ctx | undefined>(undefined);

export function ProfilePanelProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section>('overview');

  const value = useMemo<Ctx>(() => ({
    open,
    section,
    openPanel: (s: Section = 'overview') => {
      setSection(s);
      setOpen(true);
    },
    closePanel: () => setOpen(false),
  }), [open, section]);

  return (
    <ProfilePanelContext.Provider value={value}>
      {children}
    </ProfilePanelContext.Provider>
  );
}

export function useProfilePanel(): Ctx {
  const ctx = useContext(ProfilePanelContext);
  if (!ctx) throw new Error('useProfilePanel must be used within ProfilePanelProvider');
  return ctx;
}

