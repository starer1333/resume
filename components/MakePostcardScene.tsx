import { site } from "@/src/content/site";
import { DevReferenceOverlay } from "./DevReferenceOverlay";
import { ReferenceArtboard } from "./ReferenceArtboard";
import { SiteNav } from "./SiteNav";

const stamps = [
  ["stamp-one", 1223, 265, 161, 209], ["stamp-two", 1419, 297, 158, 193],
  ["stamp-three", 1223, 495, 185, 201], ["stamp-four", 1412, 516, 168, 184],
  ["stamp-five", 1259, 700, 235, 166],
] as const;

export function MakePostcardScene() {
  return (
    <ReferenceArtboard className="make-postcard-stage">
      <SiteNav dark labels={["works", "essays", "film", "about", "notes"]} />
      <a className="postcard-make-link" href="/make" aria-label="03 Make">03 _make</a>
      <img className="postcard-art" src="/assets/make-postcard/postcard.webp" alt="Vintage postcard describing things Wang Jinghan makes" />
      <img className="postcard-annotation" src="/assets/make-postcard/annotation.webp" alt="Collect some examples of my work" />
      {stamps.map(([name, left, top, width, height], index) => (
        <div key={name} className="postcard-stamp art-link" style={{ left, top, width, height }}><img src={`/assets/make-postcard/${name}.webp`} alt={site.makeProjects[index]} /></div>
      ))}
      <DevReferenceOverlay src="/@fs/D:/桌面/erbao/how-i-see/dev-references/REF-06-MAKE-POSTCARD.png" />
    </ReferenceArtboard>
  );
}
