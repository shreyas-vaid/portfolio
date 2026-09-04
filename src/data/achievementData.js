/**
 * ACHIEVEMENTS SYSTEM DATA
 * Separates Real-World Verified Achievements from Portfolio Exploration Achievements.
 */

export const achievementCategories = ["ALL", "CAREER", "EXPLORATION"];

export const achievementsList = [
  // REAL-WORLD CAREER ACHIEVEMENTS (Grounded in Verified Resume)
  {
    id: "ach-real-intern-month",
    type: "CAREER",
    name: "INTERN OF THE MONTH",
    code: "AWARD-01",
    issuer: "ThinkNEXT Technologies",
    date: "JUNE 2026",
    badge: "TOP HONORS",
    icon: "🏆",
    unlocked: true,
    description: "Awarded Intern of the Month for outstanding analytical problem-solving, dashboard architecture, and data validation during the 45-day Data Analyst internship."
  },
  {
    id: "ach-real-data-analyst",
    type: "CAREER",
    name: "DATA ANALYST SPECIALIST",
    code: "EXP-01",
    issuer: "ThinkNEXT Technologies",
    date: "MAY–JUNE 2026",
    badge: "ANALYTICS",
    icon: "💼",
    unlocked: true,
    description: "Successfully completed intensive 45-day Data Analyst internship executing exploratory data analysis (EDA), multi-variate dataset cleansing, and SQL reporting pipelines."
  },
  {
    id: "ach-real-sales-dashboard",
    type: "CAREER",
    name: "DATA EXPLORER",
    code: "PRJ-01",
    issuer: "Sales Performance Intelligence",
    date: "2025–2026",
    badge: "FEATURED",
    icon: "📊",
    unlocked: true,
    description: "Architected end-to-end Python sales analysis dashboard incorporating data cleaning, exploratory visual analytics, customer segmentation, and regional growth metrics."
  },
  {
    id: "ach-real-backend",
    type: "CAREER",
    name: "BACKEND INITIATE",
    code: "DEV-01",
    issuer: "Web & API Systems",
    date: "2024–PRESENT",
    badge: "FULL-STACK",
    icon: "⚡",
    unlocked: true,
    description: "Engineered web services and database controllers utilizing Flask, Streamlit, and relational SQL database modeling."
  },
  {
    id: "ach-real-python",
    type: "CAREER",
    name: "PYTHON OPERATIVE",
    code: "SKL-01",
    issuer: "Core Language Mastery",
    date: "2024–PRESENT",
    badge: "CORE STACK",
    icon: "🐍",
    unlocked: true,
    description: "Mastery of Python programming across Object-Oriented paradigms, data structures, automation routines, and statistical pipelines."
  },
  {
    id: "ach-real-cu",
    type: "CAREER",
    name: "ACADEMIC SCHOLAR",
    code: "EDU-01",
    issuer: "Chandigarh University",
    date: "EXPECTED MAY 2028",
    badge: "B.E. CSE",
    icon: "🏛️",
    unlocked: true,
    description: "Pursuing Bachelor of Engineering in Computer Science Engineering (Current CGPA: 7.02). Core focus in Algorithms, DBMS, and OS."
  },

  // EXPLORATION ACHIEVEMENTS (Earned by the Visitor on the website)
  {
    id: "ach-exp-init",
    type: "EXPLORATION",
    name: "FIRST CONTACT",
    code: "EXP-01",
    issuer: "System Access",
    date: "VISITOR ACTION",
    badge: "INITIALIZED",
    icon: "🚀",
    unlocked: false,
    description: "Successfully initialized the developer operating system and entered the classified portfolio environment."
  },
  {
    id: "ach-exp-explorer",
    type: "EXPLORATION",
    name: "SYSTEM EXPLORER",
    code: "EXP-02",
    issuer: "Portfolio Sector Scan",
    date: "VISITOR ACTION",
    badge: "ALL SECTORS",
    icon: "🗺️",
    unlocked: false,
    description: "Navigated through all primary portfolio sectors: Hero, Identity, Abilities, Quests, Experience, Achievements, and Contact."
  },
  {
    id: "ach-exp-terminal",
    type: "EXPLORATION",
    name: "TERMINAL OPERATOR",
    code: "EXP-03",
    issuer: "SV-OS Command Line",
    date: "VISITOR ACTION",
    badge: "OPERATOR",
    icon: "⌨️",
    unlocked: false,
    description: "Discovered and executed a diagnostic query within the SV-OS Developer Terminal."
  },
  {
    id: "ach-exp-radio",
    type: "EXPLORATION",
    name: "SUBWAVE AUDIOPHILE",
    code: "EXP-04",
    issuer: "SV Radio Broadcaster",
    date: "VISITOR ACTION",
    badge: "AUDIO SYNC",
    icon: "📻",
    unlocked: false,
    description: "Connected to SV Radio and synchronized audio frequencies."
  },
  {
    id: "ach-exp-inventory",
    type: "EXPLORATION",
    name: "QUARTERMASTER",
    code: "EXP-05",
    issuer: "JRPG Equipment Cache",
    date: "VISITOR ACTION",
    badge: "COLLECTOR",
    icon: "🎒",
    unlocked: false,
    description: "Inspected the tactical inventory modules and reviewed verified credentials."
  },
  {
    id: "ach-exp-coffee",
    type: "EXPLORATION",
    name: "CAFFEINE REQUISITION",
    code: "EXP-06",
    issuer: "Root Administrator Bypass",
    date: "VISITOR ACTION",
    badge: "EASTER EGG",
    icon: "☕",
    unlocked: false,
    description: "Attempted to execute `sudo coffee` in the terminal to request privileged coffee rations."
  },
  {
    id: "ach-exp-violet",
    type: "EXPLORATION",
    name: "VIOLET PROTOCOL OVERRIDE",
    code: "EXP-07",
    issuer: "Classified Subroutine",
    date: "VISITOR ACTION",
    badge: "SECRET OVERRIDE",
    icon: "🔮",
    unlocked: false,
    description: "Unlocked the secret alternate NIGHT // VIOLET theme by discovering the hidden system override."
  }
];
