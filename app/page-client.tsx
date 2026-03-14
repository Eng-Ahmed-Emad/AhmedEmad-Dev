"use client";

import { memo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import AppBar from "@/app/components/header/sensei-header";
import HomeSection from "@/app/components/home/sensei-home";
import LoadingScreen from "@/app/components/loader/sensei_loader";
import { useWelcomePopup } from "@/app/core/hooks/useWelcomePopup";

// ─── Dynamic imports ───────────────────────────────────────────────────────────
const AnimatedBackground = dynamic(
  () => import("@/app/components/animated_background/animated_background"),
  { ssr: false }
);
const ServicesSection = dynamic(
  () => import("@/app/components/services/sensei-services-projects"),
  { ssr: false }
);
const ExperienceSection = dynamic(
  () => import("@/app/components/experience/experience-section"),
  { ssr: false }
);
const ProjectsSection = dynamic(
  () => import("@/app/components/services/sensei-projects"),
  { ssr: false }
);
const ArtGallerySection = dynamic(
  () => import("@/app/components/art_gallery/sensei-art"),
  { ssr: false }
);
const SkillsSection = dynamic(
  () => import("@/app/components/skills/sensei-skills"),
  { ssr: false }
);
const ContactSection = dynamic(
  () => import("@/app/components/contact/sensei-contact"),
  { ssr: false }
);

// ─── WelcomePopup ─────────────────────────────────────────────────────────────
interface WelcomePopupProps {
  isHiding: boolean;
  onClose: () => void;
}

const WelcomePopup = memo(function WelcomePopup({ isHiding, onClose }: WelcomePopupProps) {
  return (
    <div
      className={`welcome-popup${isHiding ? " hide" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Welcome notification"
    >
      {/* Icon */}
      <div className="welcome-popup__icon" aria-hidden="true">
        👋
      </div>

      {/* Text */}
      <div className="welcome-popup__body">
        <span className="welcome-popup__label">Portfolio</span>
        <p className="welcome-popup__title">Welcome, Ahmed Emad</p>
        <p className="welcome-popup__subtitle">Glad you're here — enjoy the tour.</p>
      </div>

      {/* Close */}
      <button
        className="welcome-popup__close"
        onClick={onClose}
        aria-label="Dismiss welcome notification"
      >
        &times;
      </button>

      {/* Auto-dismiss progress bar */}
      <div className="welcome-popup__progress" aria-hidden="true">
        <div className="welcome-popup__progress-bar" />
      </div>
    </div>
  );
});

// ─── MainClient ───────────────────────────────────────────────────────────────
const APP_READY_DELAY_MS = 1200; // synced with loading screen

const MainClient = memo(function MainClient() {
  const [isAppReady, setIsAppReady] = useState(false);
  const { showPopup, isHiding, close } = useWelcomePopup(isAppReady);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const onReady = () => {
      timer = setTimeout(() => setIsAppReady(true), APP_READY_DELAY_MS);
    };

    if (document.readyState === "complete") {
      onReady();
    } else {
      window.addEventListener("load", onReady);
      return () => window.removeEventListener("load", onReady);
    }

    return () => clearTimeout(timer);
  }, []);

  return (
    <main style={{ position: "relative" }}>
      {!isAppReady && <LoadingScreen />}

      <div
        style={{
          opacity: isAppReady ? 1 : 0,
          pointerEvents: isAppReady ? "auto" : "none",
          height: isAppReady ? "auto" : "100vh",
          overflow: isAppReady ? "visible" : "hidden",
          transition: "opacity 0.8s ease-out",
        }}
      >
        <AnimatedBackground />
        <AppBar />
        <HomeSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <ServicesSection />
        <ContactSection />
        <ArtGallerySection />

        {showPopup && <WelcomePopup isHiding={isHiding} onClose={close} />}
      </div>
    </main>
  );
});

export default MainClient;