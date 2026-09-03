import { DevReferenceOverlay } from "./DevReferenceOverlay";
import { ReferenceArtboard } from "./ReferenceArtboard";
import { SiteNav } from "./SiteNav";

export function MakeScene() {
  const links = [
    ["Video edits", 660, 147, 356, 204], ["Photography", 699, 397, 267, 229],
    ["Visual experiments", 1005, 475, 147, 177], ["Mobile work", 700, 639, 315, 151],
  ] as const;
  return (
    <ReferenceArtboard className="paper-stage make-stage">
      <SiteNav active="works" />
      <img className="make-newspaper" src="/assets/make/newspaper.webp" alt="A handmade newspaper held open, presenting selected creative work" />
      <div className="make-hotspots" aria-label="Selected work">
        {links.map(([label, left, top, width, height]) => <a key={label} className="art-link" href={`mailto:hello@example.com?subject=${encodeURIComponent(label)}`} aria-label={label} style={{ left, top, width, height }} />)}
      </div>
      <DevReferenceOverlay src="/@fs/D:/桌面/erbao/how-i-see/dev-references/REF-05-MAKE-NEWSPAPER.png" />
    </ReferenceArtboard>
  );
}
