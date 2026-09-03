// Configuration and asset mapping for Interactive Chibi Character Companion

export const SPRITE_ASSETS = {
  LEFT: "/chibi/chibi_left_profile.png",
  LEFT_3_4: "/chibi/chibi_left_three_quarter.png",
  LEFT_FRONT: "/chibi/chibi_left_front.png",
  FRONT: "/chibi/chibi_front.png",
  RIGHT_FRONT: "/chibi/chibi_right_front.png",
  RIGHT_3_4: "/chibi/chibi_right_three_quarter.png",
  RIGHT: "/chibi/chibi_right_profile.png",
  BACK: "/chibi/chibi_back.png"
};

// All sprite image URLs for preloading
export const ALL_SPRITE_URLS = Object.values(SPRITE_ASSETS);

// Section-based character reaction dialogue
export const SECTION_DIALOGUES = {
  hero: "SYSTEM ONLINE. WELCOME.",
  identity: "CLASSIFIED DOSSIER // DECODING STATS...",
  abilities: "DATA & TECH MATRIX SYNCHRONIZED.",
  quests: "LET'S SEE WHAT I'VE BUILT.",
  experience: "OPERATIONAL TRACK RECORD LOADED.",
  achievements: "MILESTONES CLEARED // +XP GAINED.",
  contact: "TRANSMISSION CHANNEL OPEN. LET'S TALK."
};

// Interactive hover reactions
export const HOVER_DIALOGUES = {
  resume: "FETCHING VERIFIED RESUME...",
  quest: "WANT TO SEE THIS MISSION?",
  nav: "JUMPING COORDINATES...",
  contact: "ESTABLISHING ENCRYPTED DISPATCH..."
};

// Horizontal angle thresholds from character to cursor (-180 to +180)
// If character is at bottom-right, cursor is usually to the left and/or above.
export function calculateViewingState(deltaX, deltaY) {
  // Distance from character center to mouse
  const distance = Math.hypot(deltaX, deltaY);
  if (distance < 40) return "FRONT";

  // Angle in degrees from character looking forward (0 is straight up or straight towards screen)
  // deltaX < 0 means cursor is to the LEFT of the character
  // deltaX > 0 means cursor is to the RIGHT of the character
  // deltaY > 0 means cursor is BELOW the character
  
  if (deltaY > 150 && Math.abs(deltaX) < 100) {
    // Cursor is directly below
    return "FRONT";
  }

  // Calculate horizontal bearing ratio
  const ratio = deltaX / Math.max(Math.abs(deltaY), 100);

  if (ratio < -2.2) {
    return "LEFT"; // Far left
  } else if (ratio < -1.1) {
    return "LEFT_3_4"; // Mid left
  } else if (ratio < -0.3) {
    return "LEFT_FRONT"; // Slight left
  } else if (ratio > 2.2) {
    return "RIGHT"; // Far right
  } else if (ratio > 1.1) {
    return "RIGHT_3_4"; // Mid right
  } else if (ratio > 0.3) {
    return "RIGHT_FRONT"; // Slight right
  } else {
    return "FRONT"; // Center / directly ahead
  }
}
