
export const GITHUB_USERNAME = "Ahmed-Emad-Nasr";

export const knowledgeEducationItems = [
  {
    tag: "Incident Response Analyst Intern",
    subTag: "Digital Egypt Pioneers Initiative (DEPI)",
    subTagHyperlink: "https://www.depi.gov.eg/",
    desc: "Completed a 6-month DEPI training program, solving TryHackMe labs that simulate the full Incident Response (IR) lifecycle. Implemented a DEPI graduation project using ELK SIEM, Wazuh EDR, and Suricata, reducing false positive alerts by 9%.",
    isRight: true,
    startDate: "2026-01-01",
    showDate: true,
  },
  {
    tag: "Information Security Analyst Intern",
    subTag: "Digital Egypt Pioneers Initiative (DEPI)",
    subTagHyperlink: "https://www.depi.gov.eg/",
    desc: "Analyzed and triaged simulated security alerts within TryHackMe environments, applying core SOC lifecycle methodologies. Developed a DEPI capstone project using Wazuh, Suricata, VirusTotal, and YARA rules, increasing detection capabilities by 12%.",
    isRight: false,
    startDate: "2025-06-01",
    endDate: "2025-12-01",
    showDate: true,
  },
  {
    tag: "Volunteer Cybersecurity Instructor & Technical Trainer",
    subTag: "Google Developers Group (GDG) and Science In Code (SIC)",
    subTagHyperlink: "https://gdg.community.dev/",
    desc: "Delivered cybersecurity training to 120+ learners, resulting in a 40% improvement in practical skills and rating of 4.9/5.",
    isRight: true,
    startDate: "2024-10-01",
    endDate: "2025-10-01",
    showDate: true,
  },
  {
    tag: "Bachelor of Computer Science",
    desc: "Major: Information Security and Digital Forensics | GPA: 3.7/4.0",
    subTag: "Benha University",
    subTagHyperlink: "https://www.bu.edu.eg/",
    isRight: false,
    startDate: "2022-10-01",
    endDate: "2026-07-01",
    showDate: true,
  },
  {
    tag: "Cybertalents Penetration Testing Bootcamp",
    subTag: "Cybertalents",
    subTagHyperlink: "https://cybertalents.com/",
    desc: "Completed intensive penetration testing training program.",
    isRight: true,
    startDate: "2025-11-01",
    endDate: "2025-12-01",
    showDate: true,
  },
  {
    tag: "ITI Summer Cybersecurity Program",
    subTag: "Information Technology Institute",
    subTagHyperlink: "https://www.iti.gov.eg/",
    desc: "Comprehensive cybersecurity training and hands-on labs.",
    isRight: false,
    startDate: "2025-09-01",
    endDate: "2025-11-01",
    showDate: true,
  },
];

export const technicalSkills = [
  {
    category: "Tools & Platforms",
    icon: "fa-solid fa-wrench",
    skills: "Wazuh, ELK Stack, Splunk, Sysmon, Suricata, pfSense, VirusTotal, YARA, Wireshark",
  },
  {
    category: "Security Operations",
    icon: "fa-solid fa-shield-halved",
    skills: "Incident Response, Threat Hunting, Alert Triage, Detection Engineering, IOC Analysis, Playbook Execution",
  },
  {
    category: "Frameworks & Methodologies",
    icon: "fa-solid fa-sitemap",
    skills: "MITRE ATT&CK, Incident Response Lifecycle, Security Best Practices",
  },
  {
    category: "Networking",
    icon: "fa-solid fa-network-wired",
    skills: "TCP/IP, Network Traffic Analysis (NTA), IDS/IPS",
  },
  {
    category: "Malware Analysis",
    icon: "fa-solid fa-virus",
    skills: "Static Analysis, Dynamic Analysis, Sandbox Execution, YARA Rules, IOC Extraction",
  },
  {
    category: "Log Analysis & SIEM",
    icon: "fa-solid fa-chart-line",
    skills: "Log Parsing, Event Correlation, Alert Tuning, Compliance Reporting, Data Visualization",
  },
];

export const nonTechnicalSkills = [
  {
    category: "Communication",
    icon: "fa-solid fa-comments",
    skills: "Technical Writing, Presentation Skills, Cross-functional Collaboration, Stakeholder Management",
  },
  {
    category: "Leadership & Teamwork",
    icon: "fa-solid fa-people-group",
    skills: "Team Collaboration, Mentorship, Problem-solving, Analytical Thinking",
  },
  {
    category: "Professional Development",
    icon: "fa-solid fa-graduation-cap",
    skills: "Continuous Learning, Adaptability, Time Management, Technical Training",
  },
  {
    category: "Documentation & Reporting",
    icon: "fa-solid fa-file-lines",
    skills: "Incident Reports, Technical Documentation, Process Documentation, Executive Summaries",
  },
  {
    category: "Crisis Management",
    icon: "fa-solid fa-fire-extinguisher",
    skills: "Quick Decision Making, Stress Management, Priority Setting, Emergency Response",
  },
];

export const aboutMeCards = [
  {
    icon: "fa-solid fa-user",
    title: "About Me",
    description:
      "Security Operations Center (SOC) Analyst with hands-on experience in SIEM/EDR investigations, alert triage, log and IOC analysis, and incident handling. Passionate about improving detection accuracy and reducing alert fatigue through continuous threat-driven analysis.",
  },
  {
    icon: "fa-solid fa-earth-americas",
    title: "Languages",
    description:
      "Arabic: Native • English: Professional Working Proficiency (C1) - Strong in technical writing, presentations, and cross-functional communication.",
  },
  {
    icon: "fa-solid fa-heart",
    title: "Hobbies & Interests",
    description:
      "Incident response labs, malware analysis, threat hunting, CTF competitions, home lab projects, YARA rule development, and continuous learning in cybersecurity.",
  },
  {
    icon: "fa-solid fa-graduation-cap",
    title: "Education",
    description:
      "Bachelor of Computer Science from Benha University (Oct 2022 - Jul 2026). Major: Information Security and Digital Forensics. GPA: 3.7/4.0",
  },
  {
    icon: "fa-solid fa-certificate",
    title: "Certifications",
    description:
      "eCIR (eLearnSecurity), eJPT v2 (95%), Cisco CCNA (98%), DEPI Information Security Analyst, TryHackMe SOC Analyst Path, Huawei HCIA certifications.",
  },
  {
    icon: "fa-solid fa-trophy",
    title: "Achievements",
    description:
      "Best Cybersecurity Technical Award (GDG), Ranked 44th/400 in joint CTF (ITI & Cybertalents), Top 5 in National University CTF, 4.9/5 trainer rating (120+ learners).",
  },
  {
    icon: "fa-solid fa-code",
    title: "Projects & Experience",
    description:
      "Insider Threat Detection, Malware Analysis with Wazuh SIEM, SOC Environment deployment. Proficiency in Wazuh, ELK Stack, Splunk, Suricata, YARA, VirusTotal, and pfSense.",
  },
  {
    icon: "fa-solid fa-briefcase",
    title: "Professional Goals",
    description:
      "Committed to advancing cybersecurity expertise through hands-on projects, continuous learning, and contributing to secure digital environments. Aiming to become a leading SOC and incident response specialist.",
  },
  {
    icon: "fa-solid fa-running", // أيقونة الجري بتعبر عن ألعاب القوى والخماسي
    title: "Hobbies & Sports",
    description: "Modern Pentathlon athlete for 6 years at Banha Club. Currently a Track and Field athlete at Al Ahly SC since 2021, showcasing discipline and endurance.",
  },
  
  // ممكن لو حابب تفصل الهوايات التقنية عن الرياضية:
  {
    icon: "fa-solid fa-medal",
    title: "Athletic Career",
    description: "Proudly represented Al Ahly SC in Athletics (Track & Field) since 2021. Formerly a Modern Pentathlon competitor at Banha Club for over 6 years.",
  }
];
