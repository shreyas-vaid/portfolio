import { personalProfile } from "../../../data/personalProfile";
import { profileData } from "../../../data/profile";
import { abilityCategories } from "../../../data/skills";
import { questProjects } from "../../../data/projects";
import { missionHistory } from "../../../data/experience";
import { achievementsData } from "../../../data/achievements";

// Initial greeting message when chatbot boots up
export const INITIAL_BOT_MESSAGE = {
  id: "init-0",
  sender: "bot",
  text: "Hey! I'm SV-01, Shreyas's digital companion. Ask me about his projects, technical stack, stats, or what he's into outside coding!",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
};

// Conversational session memory
let lastIntent = null;

export function processQuery(userQuery) {
  const query = userQuery.trim().toLowerCase();
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // 1. GREETINGS
  if (/^(hi|hello|hey|sup|yo|greetings|howdy|what's up|who are you)/i.test(query)) {
    lastIntent = "GREETING";
    return {
      sender: "bot",
      text: "Hey there! I'm SV-01, Shreyas's interactive AI companion. You can ask me about his development projects, data analytics certifications, stats, or personal interests!",
      pose: "FRONT",
      timestamp: time
    };
  }

  // 2. MUSIC
  if (/music|song|band|artist|playlist|listen|genre/i.test(query)) {
    lastIntent = "MUSIC";
    if (personalProfile.music && personalProfile.music.length > 0) {
      return {
        sender: "bot",
        text: `🎵 **MUSIC TASTE**\n${personalProfile.music.join("\n\n")}`,
        pose: "FRONT",
        timestamp: time
      };
    }
    return {
      sender: "bot",
      text: "I don't have Shreyas's exact favorite playlist indexed in my files yet 😅! Ask him directly in the transmission terminal below.",
      pose: "CONFUSED",
      timestamp: time
    };
  }

  // 3. FOOD
  if (/food|eat|snack|dish|cuisine|coffee|tea|drink|restaurant/i.test(query)) {
    lastIntent = "FOOD";
    if (personalProfile.food && personalProfile.food.length > 0) {
      return {
        sender: "bot",
        text: `🍜 **FOOD & REFUELING**\n${personalProfile.food.join("\n\n")}`,
        pose: "FRONT",
        timestamp: time
      };
    }
    return {
      sender: "bot",
      text: "I don't have his favorite dish on file yet 😅! You'll have to ask Shreyas in the contact section.",
      pose: "CONFUSED",
      timestamp: time
    };
  }

  // 4. HOBBIES & LIFE OUTSIDE CODING
  if (/hobby|hobbies|free time|outside coding|not coding|weekend|fun|games|gaming/i.test(query)) {
    lastIntent = "HOBBIES";
    const bullets = personalProfile.hobbies.map(h => `• ${h}`).join("\n");
    return {
      sender: "bot",
      text: `🎮 **LIFE OUTSIDE THE TERMINAL**\n${bullets}`,
      pose: "FRONT",
      timestamp: time
    };
  }

  // 5. PERSONALITY
  if (/personality|vibe|what is he like|character|traits|how is he/i.test(query)) {
    lastIntent = "PERSONALITY";
    const bullets = personalProfile.personality.map(p => `• ${p}`).join("\n");
    return {
      sender: "bot",
      text: `🧠 **SHREYAS'S VIBE & PERSONALITY**\n${bullets}`,
      pose: "FRONT",
      timestamp: time
    };
  }

  // 6. GOALS
  if (/goal|goals|ambition|aspire|future|career goal|plan/i.test(query)) {
    lastIntent = "GOALS";
    const bullets = personalProfile.goals.map(g => `• ${g}`).join("\n");
    return {
      sender: "bot",
      text: `🚀 **FUTURE OBJECTIVES**\n${bullets}`,
      pose: "FRONT",
      timestamp: time
    };
  }

  // 7. FUN FACTS
  if (/fact|fun fact|trivia|random|easter egg|secret/i.test(query)) {
    lastIntent = "FUN_FACTS";
    const bullets = personalProfile.funFacts.map(f => `• ${f}`).join("\n");
    return {
      sender: "bot",
      text: `★ **CLASSIFIED DOSSIER TRIVIA**\n${bullets}`,
      pose: "FRONT",
      timestamp: time
    };
  }

  // 8. SKILLS & TECH STACK
  if (/skill|skills|tech|technolog|stack|python|sql|react|javascript|tools|matrix/i.test(query)) {
    lastIntent = "SKILLS";
    const categories = abilityCategories.map(c => `• **${c.title}**: ${c.skills.map(s => s.name).join(", ")}`).join("\n");
    return {
      sender: "bot",
      text: `💻 **CORE ABILITY MATRIX**\n${categories}\n\n*He balances frontend engineering with solid data analytics capabilities.*`,
      pose: "FOCUSED",
      timestamp: time
    };
  }

  // 9. PROJECTS & QUESTS
  if (/project|projects|quest|quests|build|portfolio work|apps/i.test(query)) {
    lastIntent = "PROJECTS";
    const projectsList = questProjects.map(p => `• **[${p.questCode}] ${p.title}**: ${p.description || p.subtitle}`).join("\n");
    return {
      sender: "bot",
      text: `⚔️ **ACTIVE QUEST DATABASE**\n${projectsList}\n\nYou can click on any quest card on the page to open its tactical dossier!`,
      pose: "FOCUSED",
      timestamp: time
    };
  }

  // 10. CERTIFICATIONS & COURSERA
  if (/certif|coursera|google data|ibm|credentials|license/i.test(query)) {
    lastIntent = "CERTS";
    return {
      sender: "bot",
      text: `📜 **VERIFIED CERTIFICATIONS**\n• **Google Data Analytics Professional Certificate** (Coursera)\n• **IBM Data Science Specialization** (Coursera)\n• Rigorous coursework in SQL, Python, Tableau, and Exploratory Data Analysis.`,
      pose: "FRONT",
      timestamp: time
    };
  }

  // 11. STATS (Creativity 110/100, Data 88/100)
  if (/stat|stats|creativity|level|score|rating|points/i.test(query)) {
    lastIntent = "STATS";
    return {
      sender: "bot",
      text: `📊 **TACTICAL ATTRIBUTES**\n• **Creativity**: 110/100 (★ BEYOND NORMAL MEASURE - overflowing gauge!)\n• **Data Analytics**: 88/100\n• **Frontend / Code**: 92/100\n• **Architecture**: 85/100\n\nTitle: **${profileData.title}**`,
      pose: "FRONT",
      timestamp: time
    };
  }

  // 12. EXPERIENCE & TIMELINE
  if (/experience|work|job|timeline|background|career/i.test(query)) {
    lastIntent = "EXPERIENCE";
    const expList = missionHistory.map(e => `• **${e.role}** at *${e.organization}* (${e.period}): ${e.description}`).join("\n");
    return {
      sender: "bot",
      text: `⏱️ **OPERATIONAL LOGS**\n${expList}`,
      pose: "FOCUSED",
      timestamp: time
    };
  }

  // 13. CONTACT & SOCIALS
  if (/contact|email|reach|hire|message|touch|linkedin|github/i.test(query)) {
    lastIntent = "CONTACT";
    return {
      sender: "bot",
      text: `📡 **TRANSMISSION CHANNELS**\n• **Email**: ${profileData.contact?.email || "shreyasvaid.dev@gmail.com"}\n• **GitHub**: [${profileData.socials?.find(s => s.name === "GitHub")?.url || "github.com/shreyas-vaid"}]\n• **LinkedIn**: [${profileData.socials?.find(s => s.name === "LinkedIn")?.url || "linkedin.com/in/shreyas-vaid"}]\n\nOr scroll to the Connection Terminal at the bottom to send a direct ping!`,
      pose: "FRONT",
      timestamp: time
    };
  }

  // 14. RESUME
  if (/resume|cv|dossier/i.test(query)) {
    lastIntent = "RESUME";
    return {
      sender: "bot",
      text: `📄 **RESUME ACCESS**\nYou can download or view Shreyas's verified resume using the **[VIEW RESUME]** button located in the Hero dossier section!`,
      pose: "FRONT",
      timestamp: time
    };
  }

  // 15. FOLLOW-UP ("tell me more", "what else")
  if (/(tell me more|more info|what else|continue|expand)/i.test(query) && lastIntent) {
    if (lastIntent === "PROJECTS") {
      return {
        sender: "bot",
        text: "Shreyas focuses on blending deep data analytics with cinematic, high-performance web frontends. Each project is designed to solve real business and algorithmic challenges.",
        pose: "FRONT",
        timestamp: time
      };
    }
    if (lastIntent === "SKILLS") {
      return {
        sender: "bot",
        text: "On the analytical side, he uses Python (Pandas, NumPy) and SQL for statistical pipelines. On the frontend, he builds reactive UI with React, Vite, and custom CSS design systems.",
        pose: "FRONT",
        timestamp: time
      };
    }
  }

  // 16. SAFE FALLBACK (Strict Anti-Hallucination)
  return {
    sender: "bot",
    text: "I don't have that information in my classified files yet 😅! I only answer verified facts from Shreyas's profile. You can ask him directly through the Contact terminal below!",
    pose: "CONFUSED",
    timestamp: time
  };
}
