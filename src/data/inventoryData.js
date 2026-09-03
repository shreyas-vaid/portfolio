/**
 * INVENTORY SYSTEM DATA
 * Grounded in Shreyas's verified resume and portfolio skills.
 */

export const INVENTORY_CATEGORIES = ["ALL", "TECH", "PROJECTS", "MISSIONS", "SECRETS"];

export const inventoryItems = [
  // TECH MODULES
  {
    id: "item-python",
    category: "TECH",
    name: "PYTHON CORE",
    rarity: "EPIC",
    level: "LVL 90",
    icon: "🐍",
    description: "Primary development language used across data analysis pipelines, automation, and backend architectures.",
    attributes: ["Data Modeling", "Automation", "OOP", "Algorithm Design"],
    unlocked: true
  },
  {
    id: "item-sql",
    category: "TECH",
    name: "SQL MODULE",
    rarity: "RARE",
    level: "LVL 88",
    icon: "🗄️",
    description: "Database querying and schema management. Proficient with complex joins, aggregation, and relational indexing.",
    attributes: ["MySQL", "Relational Modeling", "Query Optimization"],
    unlocked: true
  },
  {
    id: "item-flask",
    category: "TECH",
    name: "FLASK FRAMEWORK",
    rarity: "RARE",
    level: "LVL 85",
    icon: "⚡",
    description: "Lightweight Python microframework for developing RESTful web services, APIs, and routing controllers.",
    attributes: ["REST APIs", "Microservices", "Routing", "Middleware"],
    unlocked: true
  },
  {
    id: "item-streamlit",
    category: "TECH",
    name: "STREAMLIT TOOLKIT",
    rarity: "RARE",
    level: "LVL 86",
    icon: "📊",
    description: "Rapid development framework for data-driven applications, real-time metrics dashboards, and ML exploration.",
    attributes: ["Data Dashboards", "Reactive State", "Data Visualization"],
    unlocked: true
  },
  {
    id: "item-data-analysis",
    category: "TECH",
    name: "DATA ANALYSIS MODULE",
    rarity: "EPIC",
    level: "LVL 88",
    icon: "📈",
    description: "Statistical computing and data transformation powerhouse powered by Pandas, NumPy, and visualization libraries.",
    attributes: ["Pandas", "NumPy", "EDA", "Statistical Analysis"],
    unlocked: true
  },
  {
    id: "item-linux",
    category: "TECH",
    name: "LINUX TERMINAL",
    rarity: "COMMON",
    level: "LVL 80",
    icon: "🐧",
    description: "Ubuntu/Linux command-line proficiency, shell scripting, package management, and system environment configuration.",
    attributes: ["Bash", "File Permissions", "CLI Tooling", "Process Management"],
    unlocked: true
  },
  {
    id: "item-git",
    category: "TECH",
    name: "GIT REPOSITORY",
    rarity: "COMMON",
    level: "LVL 85",
    icon: "🌿",
    description: "Distributed version control system, branch management, collaborative workflows, and GitHub continuous integration.",
    attributes: ["Version Control", "GitHub Actions", "Code Review", "Branching"],
    unlocked: true
  },

  // PROJECTS & ARTIFACTS
  {
    id: "item-sales-dashboard",
    category: "PROJECTS",
    name: "SALES DATA DASHBOARD",
    rarity: "EPIC",
    level: "QUEST 01",
    icon: "📉",
    description: "Comprehensive Python sales performance dashboard featuring automated data cleaning, exploratory data analysis, product trends, and regional revenue growth metrics.",
    attributes: ["Python", "Pandas", "EDA", "Business Intelligence"],
    unlocked: true
  },
  {
    id: "item-cyberpunk-portfolio",
    category: "PROJECTS",
    name: "CYBERPUNK OS TERMINAL",
    rarity: "LEGENDARY",
    level: "QUEST 02",
    icon: "👾",
    description: "Interactive JRPG-inspired developer operating system built with React, Vite, Framer Motion, and Web Audio API.",
    attributes: ["React 19", "Vite", "Web Audio API", "Design System"],
    unlocked: true
  },

  // MISSIONS & CREDENTIALS
  {
    id: "item-thinknext-badge",
    category: "MISSIONS",
    name: "THINKNEXT INTERNSHIP BADGE",
    rarity: "LEGENDARY",
    level: "45 DAYS",
    icon: "🎖️",
    description: "Official credential awarded for completing an intensive 45-day Data Analyst internship at ThinkNEXT Technologies (May–June 2026). Recognized as Intern of the Month.",
    attributes: ["Data Analysis", "EDA", "ThinkNEXT Mohali", "Intern of the Month"],
    unlocked: true
  },
  {
    id: "item-chandigarh-univ",
    category: "MISSIONS",
    name: "CU ENGINEERING CREED",
    rarity: "RARE",
    level: "2024-2028",
    icon: "🏛️",
    description: "Academic insignia from Chandigarh University, pursuing B.E. in Computer Science Engineering (Expected May 2028, CGPA 7.02).",
    attributes: ["CSE", "Algorithms", "DSA", "DBMS", "OS"],
    unlocked: true
  },

  // SECRET COLLECTIBLES (Discovered via exploration)
  {
    id: "item-secret-violet",
    category: "SECRETS",
    name: "SECRET VIOLET CIPHER",
    rarity: "MYTHIC",
    level: "CLASSIFIED",
    icon: "🔮",
    description: "An encrypted cryptographic cipher that overrides the system into the legendary NIGHT // VIOLET protocol.",
    attributes: ["Theme Override", "System Hack", "Classified Protocol"],
    unlocked: false,
    secretHint: "Discover the hidden command in SV-OS Terminal or tune to Frequency 06."
  },
  {
    id: "item-coffee-thermos",
    category: "SECRETS",
    name: "SUDO COFFEE THERMOS",
    rarity: "RARE",
    level: "ITEM 404",
    icon: "☕",
    description: "High-octane fuel for deep-night coding sessions. Unlocked by attempting to bypass administrator coffee privileges.",
    attributes: ["+500 Focus", "Caffeine Overclock", "Zero Sleep Required"],
    unlocked: false,
    secretHint: "Execute `sudo coffee` in the SV-OS Developer Terminal."
  },
  {
    id: "item-freq-06-tape",
    category: "SECRETS",
    name: "FREQUENCY 06 CASSETTE",
    rarity: "EPIC",
    level: "AUDIO LOG",
    icon: "📼",
    description: "A mysterious analog cassette tape picked up from deep subspace radio frequencies on SV Radio.",
    attributes: ["Ambient Drones", "Secret Frequency", "Soundtrack Unlocked"],
    unlocked: false,
    secretHint: "Tune in to the secret Frequency 06 on SV Radio."
  }
];
