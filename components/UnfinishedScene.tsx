import { DevReferenceOverlay } from "./DevReferenceOverlay";
import { ReferenceArtboard } from "./ReferenceArtboard";
import { SiteNav } from "./SiteNav";

export function UnfinishedScene() {
  return (
    <ReferenceArtboard className="paper-stage unfinished-stage">
      <SiteNav />
      <h1 className="unfinished-title">Finished / Unfinished</h1>
      <img className="unfinished-subtitle" src="/assets/unfinished/subtitle.webp" alt="A place for things I've completed and things still becoming" />
      <section className="finished-copy"><h2>ⓥ Finished</h2><p>completed works, closed chapters,<br />and things I&apos;m proud to put out.</p></section>
      <section className="unfinished-copy"><h2>ⓧ Unfinished</h2><p>ongoing ideas, rough drafts,<br />things I haven&apos;t figured out yet.</p></section>
      <div className="unfinished-divider" />
      <div className="unfinished-tray art-link"><img src="/assets/unfinished/tray.webp" alt="Finished works arranged in a physical tray" /></div>
      <div className="unfinished-loose art-link"><img src="/assets/unfinished/loose-collage.webp" alt="Unfinished ideas, drafts, photographs, and sketches" /></div>
      <DevReferenceOverlay src="/@fs/D:/桌面/erbao/how-i-see/dev-references/REF-03-FINISHED-UNFINISHED.png" />
    </ReferenceArtboard>
  );
}
