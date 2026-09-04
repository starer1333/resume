import { site } from "@/src/content/site";

type Props = {
  active?: string;
  dark?: boolean;
  hideNotes?: boolean;
  labels?: readonly string[];
};

export function SiteNav({ active, dark = false, hideNotes = false, labels }: Props) {
  let items: readonly (typeof site.nav)[number][] = hideNotes ? site.nav.filter((item) => item.label !== "notes") : site.nav;
  if (labels) {
    items = labels
      .map((label) => site.nav.find((item) => item.label === label))
      .filter((item): item is (typeof site.nav)[number] => Boolean(item));
  }

  return (
    <>
      <a className={`site-logo ${dark ? "site-logo--dark" : ""}`} href="/" aria-label="Jinghan — home">
        jinghan
      </a>
      <nav className={`site-nav ${dark ? "site-nav--dark" : ""}`} aria-label="Primary navigation">
        {items.map((item) => (
          <a key={item.label} href={item.href} className={active === item.label ? "is-active" : undefined}>
            {item.label}
          </a>
        ))}
      </nav>
    </>
  );
}