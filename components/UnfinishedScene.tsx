import { DevReferenceOverlay } from "./DevReferenceOverlay";
import { ReferenceArtboard } from "./ReferenceArtboard";
import { SiteNav } from "./SiteNav";

export function UnfinishedScene() {
  return (
    <ReferenceArtboard className="paper-stage unfinished-stage">
      <SiteNav />
      <a className="email-doodle" href="mailto:hello@example.com" aria-label="Email Wang Jinghan"><img src="/assets/shared/email.webp" alt="" /></a>
      <h1 className="unfinished-title">Finished / Unfinished</h1>
      <img className="unfinished-subtitle" src="/assets/unfinished/subtitle.webp" alt="A place for things I've completed and things still becoming" />
      <section className="finished-copy"><h2>ⓥ Finished</h2><p>completed works, closed chapters,<br />and things I&apos;m proud to put out.</p></section>
      <section className="unfinished-copy"><h2>ⓧ Unfinished</h2><p>ongoing ideas, rough drafts,<br />things I haven&apos;t figured out yet.</p></section>
      <div className="unfinished-divider" />
      <a className="unfinished-tray art-link" href="mailto:hello@example.com?subject=Finished%20work" aria-label="View finished work"><img src="/assets/unfinished/tray.webp" alt="Finished works arranged in a physical tray" /></a>
      <a className="unfinished-loose art-link" href="mailto:hello@example.com?subject=Unfinished%20work" aria-label="View unfinished work"><img src="/assets/unfinished/loose-collage.webp" alt="Unfinished ideas, drafts, photographs, and sketches" /></a>
      <DevReferenceOverlay src="/@fs/D:/桌面/erbao/how-i-see/dev-references/REF-03-FINISHED-UNFINISHED.png" />
    </ReferenceArtboard>
  );
}
