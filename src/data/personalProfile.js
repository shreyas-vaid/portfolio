/**
 * PERSONAL PROFILE KNOWLEDGE BASE
 * 
 * This file is the single authoritative source of truth for verified personal information
 * about Shreyas that is not presented on the main resume sections.
 * 
 * Unverified placeholder information has been removed.
 * If a category is empty, the SV-01 companion will strictly respond:
 * "I don't have that information about Shreyas yet."
 */

export const personalProfile = {
  // General personality & traits (kept empty until explicitly provided)
  personality: [],

  // Music preferences & taste (kept empty until explicitly provided)
  music: [],

  // Favorite foods & beverages (canonical field)
  food: [],

  // Backward compatibility alias linking directly to canonical food array
  get favoriteFoods() {
    return this.food;
  },

  // Hobbies outside coding (kept empty until explicitly provided)
  hobbies: [],

  // Core intellectual and engineering interests verified from portfolio
  interests: [
    "Data analysis, statistical modeling, and exploratory insight.",
    "Interactive web architectures and fluid micro-interactions.",
    "System optimization and clean full-stack API design."
  ],

  // Career and development goals
  goals: [
    "Engineering systems where data tells the story and code builds the stage — merging analytical precision with creative craftsmanship to ship performant products."
  ],

  // Verified facts & milestone trivia
  funFacts: [
    "Completed an intensive 45-day Data Analyst internship at ThinkNEXT Technologies (May–June 2026), earning Intern of the Month honors in June 2026.",
    "Pursuing Bachelor of Engineering in Computer Science Engineering at Chandigarh University (Expected May 2028, CGPA 7.02).",
    "Has an overflow Creativity stat (110/100) on his character sheet.",
    "Engineered this portfolio with a custom Cyberpunk × JRPG developer terminal theme."
  ],

  // Activities outside the terminal (kept empty until explicitly provided)
  lifeOutsideCoding: []
};
