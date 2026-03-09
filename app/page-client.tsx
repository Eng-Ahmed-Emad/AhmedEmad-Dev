"use client";

import dynamic from "next/dynamic";
import AppBar from "@/app/components/header/sensei-header";
import HomeSection from "@/app/components/home/sensei-home";

const LoadingScreen = dynamic(() => import("@/app/components/loader/sensei_loader"), {
  ssr: false,
});
const AnimatedBackground = dynamic(
  () => import("@/app/components/animated_background/animated_background"),
  { ssr: false },
);
const ServicesSection = dynamic(
  () => import("@/app/components/services/sensei-services-projects"),
  { ssr: false },
);
const ExperienceSection = dynamic(
  () => import("@/app/components/experience/experience-section"),
  { ssr: false },
);
const ProjectsSection = dynamic(() => import("@/app/components/services/sensei-projects"), {
  ssr: false,
});
const ArtGallerySection = dynamic(() => import("@/app/components/art_gallery/sensei-art"), {
  ssr: false,
});
const SkillsSection = dynamic(() => import("@/app/components/skills/sensei-skills"), {
  ssr: false,
});
const ContactMeSection = dynamic(() => import("@/app/components/contact_me/sensei-contact"), {
  ssr: false,
});

export default function MainClient() {
  return (
    <main>
      <LoadingScreen />
      <AnimatedBackground />
      <AppBar />
      <HomeSection />
      <ServicesSection />
      <ExperienceSection />
      <ProjectsSection />
      <ArtGallerySection />
      <SkillsSection />
      <ContactMeSection />
    </main>
  );
}

