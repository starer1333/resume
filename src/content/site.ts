export const site = {
  name: "Wang Jinghan",
  pronunciation: "wang jing-han",
  location: "Changchun, China",
  bio: "I observe, question, make, and keep notes on the small things that shape a life.",
  email: "mailto:hello@example.com",
  social: {
    youtube: "#",
    instagram: "#",
    tiktok: "#",
    xiaohongshu: "#",
    linkedin: "#",
  },
  nav: [
    { label: "works", href: "/make" },
    { label: "essays", href: "/question" },
    { label: "film", href: "/observe" },
    { label: "about", href: "/about" },
    { label: "notes", href: "/notes" },
    { label: "contact", href: "mailto:hello@example.com" },
  ],
  cards: [
    { number: "01", title: "Observe", href: "/observe", asset: "card-observe" },
    { number: "02", title: "Question", href: "/question", asset: "card-question" },
    { number: "03", title: "Make", href: "/make", asset: "card-make" },
    { number: "04", title: "Notes", href: "/notes", asset: "card-notes" },
    { number: "05", title: "Unfinished", href: "/unfinished", asset: "card-unfinished" },
  ],
  roles: ["Photographer", "Writer", "Researcher"],
  about: {
    education: "BA Chinese Language & Literature — Jilin University",
    practice: "Photography / Writing / Research",
    interests: "Observe / Question / Make / Notes / Unfinished",
    since: "2023",
  },
  researchProjects: [
    "Memory", "Identity", "Attention", "Connection", "Meaning",
  ],
  notes: [
    { title: "Heavy Days", date: "April 12, 2023", kind: "Journal entry", asset: "frame-heavy" },
    { title: "Outgrow", date: "March 3, 2022", kind: "Scrap note", asset: "frame-outgrow" },
    { title: "Reminder", date: "May 21, 2023", kind: "Morning memo", asset: "frame-reminder" },
    { title: "Things I Want to Remember", date: "January 8, 2023", kind: "List note", asset: "frame-remember" },
  ],
  makeProjects: ["Posters", "Video Edits", "Photography", "Visual Experiments", "Collages"],
  finishedItems: ["Photo study", "Mountain series", "Botanical archive", "City Lights"],
  unfinishedItems: ["Photo series", "Short film", "Travel zine", "Essay draft"],
} as const;

export type SiteContent = typeof site;
