export const heroCenterMode: "logo" | "portrait" = "logo";

export const heroIdentity = {
  mark: "JH",
  name: "Jinghan",
  eyebrow: "personal archive / 2026",
  tagline: "observing. listening. making.",
  portrait: "/assets/home/portrait-wreath.webp",
} as const;

export const heroFragments = [
  {
    id: "guitar", number: "01", title: "Guitar", note: "strings / rhythm / practice",
    kind: "type", tone: "clay", href: null, asset: null, alt: "",
    desktop: { left: "9%", top: "20%", width: "18vw", ratio: "1.46", rotate: -7, depth: 18 },
    mobile: { left: "3%", top: "18%", width: "40vw", ratio: "1.34", rotate: -7 },
  },
  {
    id: "piano", number: "02", title: "Piano", note: "quiet keys / small repetitions",
    kind: "type", tone: "ink", href: null, asset: null, alt: "",
    desktop: { left: "75%", top: "18%", width: "16vw", ratio: "1.08", rotate: 6, depth: 32 },
    mobile: { left: "60%", top: "17%", width: "36vw", ratio: "1.08", rotate: 6 },
  },
  {
    id: "photography", number: "03", title: "Photography", note: "collecting light and evidence",
    kind: "image", tone: "moss", href: "/observe", asset: "/assets/home/camera-shelf.webp",
    alt: "A camera resting among books",
    desktop: { left: "5%", top: "52%", width: "19vw", ratio: "1.34", rotate: -3, depth: 42 },
    mobile: { left: "2%", top: "54%", width: "42vw", ratio: "1.24", rotate: -4 },
  },
  {
    id: "editing", number: "04", title: "Editing", note: "cut / pace / return",
    kind: "type", tone: "blue", href: "/make", asset: null, alt: "",
    desktop: { left: "76%", top: "53%", width: "18vw", ratio: "1.52", rotate: 4, depth: 24 },
    mobile: { left: "57%", top: "53%", width: "41vw", ratio: "1.38", rotate: 5 },
  },
  {
    id: "film", number: "05", title: "Film", note: "movement held one frame longer",
    kind: "image", tone: "charcoal", href: "/observe", asset: "/assets/home/film.webp",
    alt: "A floral film strip from Jinghan's visual archive",
    desktop: { left: "28%", top: "72%", width: "16vw", ratio: "1.54", rotate: 5, depth: 28 },
    mobile: { left: "5%", top: "75%", width: "40vw", ratio: "1.5", rotate: 4 },
  },
  {
    id: "aesthetic", number: "06", title: "Visual taste", note: "colour / texture / atmosphere",
    kind: "image", tone: "sage", href: "/notes", asset: "/assets/home/vase.webp",
    alt: "A quiet still life with flowers and ceramics",
    desktop: { left: "57%", top: "73%", width: "18vw", ratio: "1.65", rotate: -4, depth: 36 },
    mobile: { left: "55%", top: "75%", width: "42vw", ratio: "1.48", rotate: -4 },
  },
] as const;