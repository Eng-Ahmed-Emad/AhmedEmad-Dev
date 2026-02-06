import React from "react";
import AppBar from "@/app/com/header/sensei-header";
import HomeSection from "@/app/com/home/home";
import ExperienceSection from "@/app/com/experience/experience-section";
import ContactMeSection from "@/app/com/contact_me/sensei-contact";
import LoadingScreen from "@/app/com/loader/sensei_loader";
import AnimatedBackground from "@/app/com/animated_background/animated_background";
import SenseiProjects from "./com/services/sensei-projects";
import SenseiArt from "@/app/com/art_gallery/sensei-art"


/*
*@Author: Ahmed_Sensei
*@Description: A responsive experience component with a menu that highlights the active section of the page.
 */

function Main() {
    return (
        <>
            <LoadingScreen />
            <AnimatedBackground />
            <AppBar />
            <HomeSection />
            {/*<ServicesSection />*/}
            <ExperienceSection />
            <SenseiProjects />
            <SenseiArt />
            <ContactMeSection />
        </>
    );
}
export default Main;
