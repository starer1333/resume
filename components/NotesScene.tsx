import { site } from "@/src/content/site";
import { DevReferenceOverlay } from "./DevReferenceOverlay";
import { ReferenceArtboard } from "./ReferenceArtboard";
import { SiteNav } from "./SiteNav";

const positions = [
  [90, 221, 368, 435, 142, 681, 232, 150], [454, 224, 346, 433, 516, 691, 226, 148],
  [830, 222, 304, 398, 882, 637, 242, 154], [1182, 226, 400, 437, 1238, 688, 286, 151],
] as const;

export function NotesScene() {
  return (
    <ReferenceArtboard className="paper-stage notes-stage">
      <SiteNav active="notes" />
      <h1 className="notes-title">Notes</h1>
      {site.notes.map((note, index) => {
        const [left, top, width, height, labelLeft, labelTop, labelWidth, labelHeight] = positions[index];
        return <article key={note.title}>
          <a className="note-frame art-link" href={`${site.email}?subject=${encodeURIComponent(note.title)}`} aria-label={`Read ${note.title}`} style={{ left, top, width, height }}><img src={`/assets/notes/${note.asset}.webp`} alt={note.title} /></a>
          <div className="museum-label" style={{ left: labelLeft, top: labelTop, width: labelWidth, height: labelHeight }}><strong>{note.title}</strong><span>{note.date}</span><small>{note.kind}</small></div>
        </article>;
      })}
      <DevReferenceOverlay src="/@fs/D:/桌面/erbao/how-i-see/dev-references/REF-04-NOTES.png" />
    </ReferenceArtboard>
  );
}
