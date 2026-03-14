"use client";

import { memo, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import AppBar from "@/app/components/header/sensei-header";
import HomeSection from "@/app/components/home/sensei-home";
import LoadingScreen from "@/app/components/loader/sensei_loader";

// ─── Dynamic imports ──────────────────────────────────────────────────────────
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

// ─── MainClient ───────────────────────────────────────────────────────────────

const MainClient = memo(function MainClient() {
  const [isAppReady, setIsAppReady] = useState(false);
  
  // States الخاصة بالإشعار الترحيبي
  const [showPopup, setShowPopup] = useState(false);
  const [isPopupHiding, setIsPopupHiding] = useState(false);

  useEffect(() => {
    const handleAppReady = () => {
      // ⏱️ تم ضبط الوقت لـ 1200 مللي ثانية ليتزامن تماماً مع شاشة التحميل
      setTimeout(() => {
        setIsAppReady(true);
      }, 1200); 
    };

    if (document.readyState === "complete") {
      handleAppReady();
    } else {
      window.addEventListener("load", handleAppReady);
      return () => window.removeEventListener("load", handleAppReady);
    }
  }, []);

  // دالة إغلاق الإشعار (استخدمنا useCallback لضمان عملها بسلاسة داخل useEffect)
  const handleClosePopup = useCallback(() => {
    setIsPopupHiding(true); // تفعيل حركة الخروج في CSS
    setTimeout(() => {
      setShowPopup(false); // إزالة العنصر تماماً بعد انتهاء الحركة
    }, 500);
  }, []);

  // تأثير (Effect) لإظهار الإشعار وإخفائه تلقائياً
  useEffect(() => {
    let showTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    if (isAppReady) {
      // 1. إظهار الإشعار بعد ثانية واحدة من فتح الموقع بالكامل
      showTimer = setTimeout(() => {
        setShowPopup(true);
        
        // 2. إخفاء الإشعار تلقائياً بعد 5 ثوانٍ من ظهوره (5000 مللي ثانية)
        hideTimer = setTimeout(() => {
          handleClosePopup();
        }, 2500);

      }, 1000);
    }

    // تنظيف المؤقتات إذا تم إغلاق الصفحة لمنع أي أخطاء
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isAppReady, handleClosePopup]);

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

        {/* ─── Welcome Popup ─── */}
        {showPopup && (
          <div className={`welcome-popup ${isPopupHiding ? "hide" : ""}`}>
            <p>Welcome To Ahmed Emad Portfolio</p>
            <button 
              className="close-btn" 
              onClick={handleClosePopup} 
              aria-label="Close Welcome Popup"
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </main>
  );
});

export default MainClient;