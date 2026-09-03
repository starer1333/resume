import { site } from "@/src/content/site";
import { ReferenceArtboard } from "./ReferenceArtboard";
import { SiteNav } from "./SiteNav";
import { DevReferenceOverlay } from "./DevReferenceOverlay";

const roles = [
  ["role-photographer", 103, 629, 216, 170],
  ["role-writer", 381, 631, 200, 190],
  ["role-researcher", 628, 598, 191, 210],
] as const;

export function AboutScene() {
  return (
    <ReferenceArtboard className="paper-stage about-stage">
      <SiteNav labels={["works", "essays", "notes", "about", "contact"]} />
      <section className="about-intro" aria-labelledby="about-heading">
        <h1 id="about-heading">
          Hi, my name is
          <strong>{site.name}.</strong>
        </h1>
        <img src="/assets/about/pronunciation.webp" alt={`pronounced ${site.pronunciation}`} />
      </section>
      <div className="roles-heading" aria-hidden="true">&gt; CURRENT ROLES &gt;&gt;</div>
      {roles.map(([name, left, top, width, height], index) => (
        <img
          key={name}
          className="role-stamp"
          src={`/assets/about/${name}.webp`}
          alt={site.roles[index]}
          style={{ left, top, width, height }}
        />
      ))}
      <img
        className="passport-art"
        src="/assets/about/passport.webp"
        alt={`Passport-style profile for ${site.name}, based in ${site.location}. ${site.about.practice}.`}
      />
      <DevReferenceOverlay src="/@fs/D:/桌面/erbao/how-i-see/dev-references/REF-09-ABOUT.png" />
    </ReferenceArtboard>
  );
}
