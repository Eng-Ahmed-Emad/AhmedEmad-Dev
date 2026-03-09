export const getIconForLanguage = (language: string | null): string => {
  const iconMap: { [key: string]: string } = {
    TypeScript: "fa-brands fa-react",
    JavaScript: "fa-brands fa-js",
    Python: "fa-brands fa-python",
    HTML: "fa-brands fa-html5",
    CSS: "fa-brands fa-css3",
    Java: "fa-brands fa-java",
    PHP: "fa-brands fa-php",
    Kotlin: "fa-brands fa-android",
    Swift: "fa-brands fa-swift",
    PowerShell: "fa-solid fa-terminal",
    Shell: "fa-solid fa-terminal",
    VisualBasic: "fa-brands fa-windows",
  };

  return iconMap[language ?? ""] || "fa-solid fa-code";
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
