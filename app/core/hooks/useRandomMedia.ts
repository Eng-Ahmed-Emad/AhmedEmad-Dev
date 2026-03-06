"use client";

export const useRandomMedia = () => {
  const videoUrl: string = "https://youtu.be/A0xHuA4jmgs?si=6UbIqEzhXjP8CaLQ";

  const handleImageClick = (): void => {
    window.open(videoUrl, "_blank");
  };

  return { handleImageClick };
};
