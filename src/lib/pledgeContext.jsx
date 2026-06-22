/* ============================================================
   PLEDGE CONTEXT — Tracks if user has accepted The Code
   Also exposes a trigger to open the pledge modal
   ============================================================ */
import React, { createContext, useContext, useState } from 'react';

const PledgeContext = createContext();

export function PledgeProvider({ children }) {
  const [pledgeAccepted, setPledgeAccepted] = useState(() => {
    return localStorage.getItem('bitw_pledge') === 'true';
  });
  const [pledgeOpen, setPledgeOpen] = useState(false);

  const acceptPledge = () => {
    setPledgeAccepted(true);
    localStorage.setItem('bitw_pledge', 'true');
  };

  const openPledge = () => setPledgeOpen(true);

  return (
    <PledgeContext.Provider value={{ pledgeAccepted, acceptPledge, pledgeOpen, setPledgeOpen, openPledge }}>
      {children}
    </PledgeContext.Provider>
  );
}

export const usePledge = () => useContext(PledgeContext);