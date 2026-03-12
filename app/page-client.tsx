"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import AppBar from "@/app/components/header/sensei-header";
import HomeSection from "@/app/components/home/sensei-home";
import LoadingScreen from "@/app/components/loader/sensei_loader";

// ─── Dynamic imports ──────────────────────────────────────────────────────────
// ssr: false prevents hydration mismatches with Framer Motion and canvas APIs.
// Each section is code-split — only downloaded when needed.

const AnimatedBackground = dynamic(
  () => import("@/app/components/animated_background/animated_background"),
  { ssr: false }
);
const CustomCursor = dynamic(
  () => import("@/app/components/cursor/CustomCursor"),
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
  () => import("@/app/components/contact/sensei-contact"), // تأكد من المسار حسب ما سميت الفولدر
  { ssr: false }
);

// ─── MainClient ───────────────────────────────────────────────────────────────

// Memoised to prevent cascading re-renders from any parent context changes.
const MainClient = memo(function MainClient() {
  return (
    <main>
      <LoadingScreen />
      <CustomCursor />
      <AnimatedBackground />
      <AppBar />
      <HomeSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectsSection />
      <ServicesSection />
      <ContactSection />
      <ArtGallerySection />
    </main>
  );
});

export default MainClient;