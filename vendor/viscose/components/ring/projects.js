// Ring order, not filename order. Art is dealt straight down this list, so
// entry n sits one slot along from n-1 and the column can count 01..18 as the
// carousel turns. Reordering these rows moves the ring, the column and the
// numbering together; nothing else needs touching.
//
// TODO: every `type` and `year` is placeholder. Names marked (*) are guesses
// at the subject — the artwork carries no wordmark to read them off.
export const PROJECTS = [
  { file: "assets/observe/10.webp", name: "Matchday", type: "Motion", year: "2025" }, // *
  { file: "assets/observe/12.webp", name: "Nightshift", type: "Art Direction", year: "2023" }, // *
  { file: "assets/observe/14.webp", name: "Volt", type: "Branding", year: "2024" }, // *
  { file: "assets/observe/16.webp", name: "Keycard", type: "Product Design", year: "2026" }, // *
  { file: "assets/observe/18.webp", name: "None", type: "Photography", year: "2026" },
  { file: "assets/observe/02.webp", name: "Prestige Equine", type: "Web Design", year: "2025" },
  { file: "assets/observe/04.webp", name: "Blue Room", type: "Identity", year: "2023" }, // *
  { file: "assets/observe/06.webp", name: "Steininvest", type: "Web Design", year: "2024" },
  { file: "assets/observe/08.webp", name: "CENE+", type: "Branding", year: "2026" },
  { file: "assets/observe/09.webp", name: "Snuff", type: "Editorial", year: "2024" },
  { file: "assets/observe/07.webp", name: "Iris", type: "Photography", year: "2023" }, // *
  { file: "assets/observe/05.webp", name: "Sevenworlds", type: "Development", year: "2025" },
  { file: "assets/observe/03.webp", name: "Irse a Volver", type: "Art Direction", year: "2024" },
  { file: "assets/observe/01.webp", name: "PM24", type: "Branding", year: "2024" },
  { file: "assets/observe/17.webp", name: "Favor", type: "E-commerce", year: "2025" },
  { file: "assets/observe/15.webp", name: "Freshweb", type: "Web Design", year: "2025" },
  { file: "assets/observe/13.webp", name: "Proba", type: "Development", year: "2026" },
  { file: "assets/observe/11.webp", name: "MVN", type: "Identity", year: "2025" },
];

export const IMAGE_FILES = PROJECTS.map((p) => p.file);
