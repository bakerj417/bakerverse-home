/**
 * Site-wide data. Anything global that more than one page
 * references lives here so there's a single source of truth.
 */

export const site = {
  name: "Joseph Baker",
  handle: "JB",
  title: "Joseph Baker — Full-stack engineer, Bakerverse",
  description:
    "Full-stack engineer with 15+ years of experience. React Native, TypeScript, Go, design systems, and the ever-growing Bakerverse of tools and services.",
  url: "https://josephkbaker.com",
  location: "Waxhaw, North Carolina",
  email: "bakerj417@gmail.com",
  resumeUrl: "/joseph-baker-resume.pdf",
  business: {
    name: "Baker Software Solutions",
    tagline: "Freelance & side engagements",
  },
} as const;

export const nav = [
  { href: "/", label: "Home", glyph: "⌂" },
  { href: "/about", label: "About", glyph: "✦" },
  { href: "/work", label: "Work", glyph: "⚔" },
  { href: "/projects", label: "Projects", glyph: "◆" },
  { href: "/bakerverse", label: "Bakerverse", glyph: "✴" },
  { href: "/contact", label: "Contact", glyph: "✉" },
] as const;

export const socials = [
  {
    label: "GitHub",
    href: "https://github.com/bakerj417",
    handle: "@bakerj417",
    glyph: "gh",
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com/bakerj417",
    handle: "@bakerj417",
    glyph: "x",
  },
  {
    label: "Email",
    href: "mailto:bakerj417@gmail.com",
    handle: "bakerj417@gmail.com",
    glyph: "@",
  },
] as const;

/**
 * Character-sheet style stats shown on /about and the Home hero.
 * These are *presentation*, not calculations — tweak values to taste.
 */
export const characterSheet = {
  class: "Full-stack Engineer",
  specialization: "React Native · Frontend · Design Systems",
  guild: "Baker Software Solutions",
  homeRealm: "Waxhaw, NC",
  level: 15, // years of experience
  stats: [
    { label: "Years engineering", value: "15+" },
    { label: "Core stack", value: "TS · RN · Node" },
    { label: "Specialization", value: "Mobile + Frontend + Design Systems" },
    { label: "Alignment", value: "Neutral Good · Pragmatic" },
  ],
  // A short list of "proficiencies" — used as stack badges on About.
  proficiencies: [
    "TypeScript",
    "Node.js",
    "React",
    "React Native",
    "Expo",
    "Go",
    "Elixir",
    "C#",
    "PHP",
    "PostgreSQL",
    "MySQL",
    "AWS",
    "Jest",
    "Maestro",
    "CI/CD",
    "Design Systems",
    "Systems Architecture",
  ],
} as const;
