import React, { createContext, useContext, useRef, useState } from "react";

interface AppContextType {
  clickCount: number;
  incrementClick: () => boolean;
  showInterstitial: boolean;
  dismissInterstitial: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const INTERSTITIAL_EVERY = 3;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const clickCount = useRef(0);
  const [showInterstitial, setShowInterstitial] = useState(false);

  const incrementClick = (): boolean => {
    clickCount.current += 1;
    if (clickCount.current % INTERSTITIAL_EVERY === 0) {
      setShowInterstitial(true);
      return true;
    }
    return false;
  };

  const dismissInterstitial = () => setShowInterstitial(false);

  return (
    <AppContext.Provider
      value={{
        clickCount: clickCount.current,
        incrementClick,
        showInterstitial,
        dismissInterstitial,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}
