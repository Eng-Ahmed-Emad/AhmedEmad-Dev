// Import necessary dependencies and styles
"use client";
import React, { ReactElement } from 'react';
import { motion } from "framer-motion";
import { Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./sensei-services-projects.module.css";

/*
*@Author: Ahmed_Sensei
*@Description: A responsive experience component with a menu that highlights the active section of the page.
 */


/**
 * A function component that renders a single service item.
 *
 * @param {{ icon: string; title: string; description: string; index: number; }} props
 * The props object should have the following properties:
 * - `icon`: The class name of the font awesome icon to use.
 * - `title`: The title of the service.
 * - `description`: A brief description of the service.
 * - `index`: The index of the service in the list for animation delay purposes.
 *
 * @returns {ReactElement} A React element representing a single service item.
 */
const ServiceItem: React.FC<{
    icon: string;
    title: string;
    description: string;
    index: number;
}> = ({ icon, title, description, index }): ReactElement => {
    // useInView hook to track if the element is visible in the viewport
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    // Define animation variants for Framer Motion
    const variants: Variants = {
        hidden: { opacity: 0, y: 48 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: index * 0.18,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            className={styles['single-service']}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={variants}
        >
            <div className={styles['part-1']}>
                <motion.i
                    className={icon}
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                ></motion.i>
                <h3 className={styles.title}>{title}</h3>
            </div>
            <div className={styles['part-2']}>
                <p className={styles.description}>{description}</p>
            </div>
        </motion.div>
    );
};

/**
 * A React component that displays a list of service items in a grid format.
 * Each service item is rendered using the ServiceItem component and is animated when it appears in the viewport.
 *
 * @returns {ReactElement} A React element representing the services section.
 */
function SenseiServicesProjects(): ReactElement {
    const services = [
        {
            icon: "fa-brands fa-flutter",
            title: "Mobile App Development",
            description: "Develop user-friendly and efficient mobile apps. Utilize Flutter for cross-platform development, implement responsive UI designs, and integrate RESTful APIs."
        },

        {
            icon: "fa-brands fa-android",
            title: "Android App Development",
            description: "Create secure and scalable Android apps. Use Kotlin for modern development, implement Material Design principles, and ensure compatibility across various Android versions."
        },

        {
            icon: "fa-solid fa-server",
            title: "Backend Development",
            description: "Build robust and scalable backend systems using Python. FastAPI , Django for rapid development, implement RESTful APIs with FastAPI , and utilize MongoDB,MySQL, and PostgreSQL for efficient data management."
        },

        {
            icon: "fa-solid fa-microchip",
            title: "AI Development",
            description: "Develop intelligent systems with Python. Use TensorFlow and PyTorch for deep learning models, implement natural language processing with NLTK, and create computer vision solutions with OpenCV."
        },

        {
            icon: "fa-solid fa-gamepad",
            title: "Game Development",
            description: "Design immersive games with Unreal Engine. Utilize Blueprints visual scripting for rapid prototyping, implement realistic physics with PhysX, and create stunning visuals with the Unreal Engine renderer."
        },

        {
            icon: "fa-solid fa-paintbrush",
            title: "Digital Artist",
            description: "Create visually appealing digital artwork using Krita. Employ custom brushes for unique textures, utilize layer management for complex compositions, and implement digital painting techniques."
        },

        {
            icon: "fa-solid fa-palette",
            title: "Graphic Designer",
            description: "Craft professional graphics with Adobe Creative Suite. Design vector graphics in Illustrator, edit and manipulate images in Photoshop, and create layouts for print and digital media in InDesign."
        },

        {
            icon: "fa-solid fa-images",
            title: "Photography",
            description: "Capture visually striking and unique photographs. Specialize in portrait, landscape, and event photography. Edit images using Adobe Lightroom and Photoshop for professional results."
        }
    ];

    // useInView hook to track if the header is visible in the viewport
    const [headerRef, headerInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <section className={styles['section-services']} id="Services">
            <div className={styles.container}>
                <motion.div
                    ref={headerRef}
                    className={styles['header-section']}
                    initial={{ opacity: 0, y: -50 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h2 className={styles.title}>
                        <span lang="ja">
                            事業 •
                        </span>
                        <span lang="en"> Services
                        </span>
                    </h2>
                </motion.div>
                <div className={styles['grid-container']}>
                    {services.map((service, index) => (
                        <ServiceItem key={index} {...service} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default SenseiServicesProjects;
