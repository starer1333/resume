import { ReferenceArtboard } from "./ReferenceArtboard";
import { SiteNav } from "./SiteNav";
import { DevReferenceOverlay } from "./DevReferenceOverlay";

const pieces = [
  ["flowers-top", 340, 86, 146, 206],
  ["collect-note", 479, 128, 130, 160],
  ["window-top", 605, 96, 185, 196],
  ["vase", 792, 93, 160, 188],
  ["portrait-top", 973, 123, 156, 172],
  ["coast", 1114, 142, 146, 122],
  ["fern", 1258, 110, 134, 161],
  ["coffee", 153, 344, 158, 169],
  ["photo-booth", 314, 294, 182, 225],
  ["film", 505, 393, 116, 190],
  ["today-note", 1004, 315, 164, 239],
  ["camera-shelf", 1164, 286, 162, 139],
  ["field-frame", 1314, 259, 176, 149],
  ["friend-strip", 1344, 399, 118, 197],
  ["moment-note", 1414, 404, 146, 188],
  ["little-note", 166, 530, 145, 133],
  ["market", 321, 530, 177, 138],
  ["camera", 277, 657, 122, 93],
  ["botanical-cat", 494, 584, 210, 185],
  ["ticket", 994, 580, 154, 128],
  ["window-frame", 1164, 579, 158, 245],
  ["memory-note", 1306, 638, 164, 193],
  ["embroidery", 372, 713, 171, 202],
  ["stamp", 532, 735, 184, 185],
  ["landscape-wide", 690, 707, 296, 219],
  ["tram", 973, 746, 176, 170],
] as const;

export function HomeScene() {
  return (
    <ReferenceArtboard className="paper-stage home-stage">
      <SiteNav />
      <a className="email-doodle" href="mailto:hello@example.com" aria-label="Email Wang Jinghan">
        <img src="/assets/shared/email.webp" alt="" />
      </a>
      {pieces.map(([name, x, y, width, height]) => (
        <img
          key={name}
          className="collage-piece"
          src={`/assets/home/${name}.webp`}
          alt=""
          aria-hidden="true"
          style={{ left: x, top: y, width, height }}
        />
      ))}
      <img
        className="collage-piece"
        src="/assets/home/portrait-wreath.webp"
        alt="Portrait of Wang Jinghan framed with flowers"
        style={{ left: 676, top: 282, width: 326, height: 308 }}
      />
      <div className="home-title">
        <h1>HOW I SEE</h1>
        <p>observing. feeling. remembering.</p>
      </div>
      <img className="scroll-doodle" src="/assets/shared/scroll.webp" alt="Scroll down" />
      <DevReferenceOverlay src="/@fs/D:/桌面/erbao/how-i-see/dev-references/REF-01-HOME.png" />
    </ReferenceArtboard>
  );
}
