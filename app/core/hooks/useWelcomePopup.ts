"use client";

import { useState, useEffect, useCallback } from "react";

const SHOW_DELAY_MS   = 1000;  // delay after app ready before popup appears
const VISIBLE_MS      = 3500;  // how long popup stays visible (must match --popup-progress-duration)
const SLIDE_OUT_MS    = 500;   // must match --popup-slide-out-duration

interface UseWelcomePopupReturn {
  showPopup: boolean;
  isHiding: boolean;
  close: () => void;
}

export function useWelcomePopup(isAppReady: boolean): UseWelcomePopupReturn {
  const [showPopup, setShowPopup]   = useState(false);
  const [isHiding, setIsHiding]     = useState(false);

  const close = useCallback(() => {
    setIsHiding(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsHiding(false);
    }, SLIDE_OUT_MS);
  }, []);

  useEffect(() => {
    if (!isAppReady) return;

    const showTimer = setTimeout(() => {
      setShowPopup(true);
      const hideTimer = setTimeout(close, VISIBLE_MS);
      return () => clearTimeout(hideTimer);
    }, SHOW_DELAY_MS);

    return () => clearTimeout(showTimer);
  }, [isAppReady, close]);

  return { showPopup, isHiding, close };
}