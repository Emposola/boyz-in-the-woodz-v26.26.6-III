/* ============================================================
   PLEDGE CONTEXT — Tracks if user has accepted The Code
   Now persists to DB (profiles.pledge_accepted) for logged-in users
   Falls back to localStorage for guests
   ============================================================ */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const PledgeContext = createContext();

export function PledgeProvider({ children }) {
  const [pledgeAccepted, setPledgeAccepted] = useState(() => {
    return localStorage.getItem('bitw_pledge') === 'true';
  });
  const [pledgeOpen, setPledgeOpen] = useState(false);

  const acceptPledge = async (userId) => {
    setPledgeAccepted(true);
    localStorage.setItem('bitw_pledge', 'true');

    if (userId) {
      await supabase
        .from('profiles')
        .update({
          pledge_accepted: true,
          pledged_at: new Date().toISOString(),
        })
        .eq('id', userId);
    }
  };

  const openPledge = () => setPledgeOpen(true);

  return (
    <PledgeContext.Provider value={{ pledgeAccepted, acceptPledge, pledgeOpen, setPledgeOpen, openPledge }}>
      {children}
    </PledgeContext.Provider>
  );
}

export const usePledge = () => useContext(PledgeContext);