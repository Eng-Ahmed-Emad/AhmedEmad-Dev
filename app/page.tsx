import AppBar from "@/app/components/header/sensei-header";
import HomeSection from "@/app/components/home/sensei-home";
import ServicesSection from "@/app/components/services/sensei-services-projects";
import ExperienceSection from "@/app/components/experience/experience-section";
import ArtGallerySection from "@/app/components/art_gallery/sensei-art";
import ContactMeSection from "@/app/components/contact_me/sensei-contact";
import LoadingScreen from "@/app/components/loader/sensei_loader";
import AnimatedBackground from "@/app/components/animated_background/animated_background";
import ProjectsSection from "@/app/components/services/sensei-projects";

// Main component
// @returns {JSX.Element}
// @author Ahmed Emad Nasr
// @description A functional component that renders the page of the website.

function Main() {
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
      <ContactMeSection />
    </main>
  );
}
export default Main;
