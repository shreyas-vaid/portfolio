// Configuration and asset mapping for Roaming Interactive Chibi Character Companion

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

export const ALL_SPRITE_URLS = Object.values(SPRITE_ASSETS);

// Section-specific reaction micro-dialogues
export const SECTION_DIALOGUES = {
  hero: "EXPLORING PORTFOLIO... WELCOME.",
  identity: "INSPECTING ARCHITECT PROFILE & STATS.",
  abilities: "ANALYZING TECHNICAL ABILITY MATRIX...",
  quests: "CHECKING OUT ACTIVE MISSIONS.",
  experience: "READING DEPLOYMENT TIMELINE...",
  achievements: "NICE! MILESTONES CLEARED.",
  contact: "TRANSMISSION READY. LET'S CONNECT!"
};

// Interactive hover micro-dialogues
export const HOVER_DIALOGUES = {
  resume: "FETCHING CREDENTIALS...",
  quest: "INSPECTING THIS PROJECT...",
  nav: "HEADING TOWARDS NEXT SECTION...",
  contact: "READY TO DISPATCH A TRANSMISSION?"
};

// Calculate facing direction when character is WALKING towards (dx, dy)
export function calculateWalkDirection(dx, dy) {
  // If negligible movement, keep facing forward
  if (Math.hypot(dx, dy) < 2) return "FRONT";

  // Angle in degrees from positive X axis (0 = right, 90 = down, 180 = left, -90 = up)
  const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);

  if (angleDeg >= -25 && angleDeg <= 25) {
    return "RIGHT";
  } else if (angleDeg > 25 && angleDeg <= 70) {
    return "RIGHT_3_4";
  } else if (angleDeg > 70 && angleDeg <= 110) {
    return "FRONT"; // Walking downwards towards camera
  } else if (angleDeg > 110 && angleDeg <= 155) {
    return "LEFT_3_4";
  } else if (angleDeg > 155 || angleDeg < -155) {
    return "LEFT";
  } else if (angleDeg >= -155 && angleDeg < -110) {
    return "LEFT_3_4";
  } else if (angleDeg >= -110 && angleDeg < -70) {
    return "BACK"; // Walking upwards away from camera
  } else {
    return "RIGHT_3_4";
  }
}

// Calculate gaze direction towards cursor when character is IDLE / STOPPED
export function calculateCursorGazeDirection(deltaX, deltaY) {
  const distance = Math.hypot(deltaX, deltaY);
  if (distance < 30) return "FRONT";

  // When cursor is directly above (far behind the character)
  if (deltaY < -150 && Math.abs(deltaX) < 100) {
    return "BACK";
  }

  // When cursor is directly below
  if (deltaY > 150 && Math.abs(deltaX) < 80) {
    return "FRONT";
  }

  // Ratio of horizontal distance to vertical separation
  const ratio = deltaX / Math.max(Math.abs(deltaY), 80);

  if (ratio < -2.0) {
    return "LEFT"; // Far left
  } else if (ratio < -0.9) {
    return "LEFT_3_4"; // Mid left
  } else if (ratio < -0.25) {
    return "LEFT_FRONT"; // Slight left
  } else if (ratio > 2.0) {
    return "RIGHT"; // Far right
  } else if (ratio > 0.9) {
    return "RIGHT_3_4"; // Mid right
  } else if (ratio > 0.25) {
    return "RIGHT_FRONT"; // Slight right
  } else {
    return "FRONT"; // Neutral front
  }
}

// Safe roaming boundary coordinates for each section (as percentages of viewport)
export const SECTION_ROAM_ZONES = {
  hero: [
    { x: 0.80, y: 0.65 }, // Right side under stats
    { x: 0.70, y: 0.78 },
    { x: 0.85, y: 0.75 },
    { x: 0.50, y: 0.82 }
  ],
  identity: [
    { x: 0.85, y: 0.70 },
    { x: 0.15, y: 0.75 },
    { x: 0.75, y: 0.80 },
    { x: 0.25, y: 0.82 }
  ],
  abilities: [
    { x: 0.82, y: 0.72 },
    { x: 0.18, y: 0.76 },
    { x: 0.70, y: 0.84 },
    { x: 0.30, y: 0.80 }
  ],
  quests: [
    { x: 0.85, y: 0.68 },
    { x: 0.15, y: 0.72 },
    { x: 0.50, y: 0.82 },
    { x: 0.80, y: 0.80 }
  ],
  experience: [
    { x: 0.85, y: 0.70 },
    { x: 0.20, y: 0.75 },
    { x: 0.75, y: 0.82 }
  ],
  achievements: [
    { x: 0.85, y: 0.72 },
    { x: 0.18, y: 0.78 },
    { x: 0.55, y: 0.80 }
  ],
  contact: [
    { x: 0.82, y: 0.70 },
    { x: 0.20, y: 0.75 },
    { x: 0.70, y: 0.82 }
  ]
};
