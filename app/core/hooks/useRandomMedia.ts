"use client";

// ─── Statics ──────────────────────────────────────────────────────────────────

// Hoisted at module level — the URL never changes, so there's no reason to
// recreate it inside the hook on every call.
const VIDEO_URL = "https://youtu.be/9gK7uyTGxz8?si=GiQOXFyaSJjVO2HR&t=230";

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useRandomMedia = () => {
  // handleImageClick is a stable module-level reference — no closure over
  // component state, so it never needs to be recreated.
  return { handleImageClick };
};

function handleImageClick(): void {
  window.open(VIDEO_URL, "_blank");
}