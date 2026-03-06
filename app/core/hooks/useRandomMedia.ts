"use client";

export const useRandomMedia = () => {
  const videoUrl: string = "https://youtu.be/9gK7uyTGxz8?si=N6eSrfE-wHK6UsI6&t=212";

  const handleImageClick = (): void => {
    window.open(videoUrl, "_blank");
  };

  return { handleImageClick };
};
