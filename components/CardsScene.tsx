import { site } from "@/src/content/site";
import { ReferenceArtboard } from "./ReferenceArtboard";
import { SiteNav } from "./SiteNav";
import { DevReferenceOverlay } from "./DevReferenceOverlay";

const cardPositions = [
  [128, 271, 264, 412],
  [434, 279, 255, 408],
  [727, 279, 255, 409],
  [1028, 279, 258, 414],
  [1325, 280, 259, 415],
] as const;

export function CardsScene() {
  return (
    <ReferenceArtboard className="paper-stage cards-stage">
      <SiteNav hideNotes />
      <a className="email-doodle" href={site.email} aria-label="Email Wang Jinghan">
        <img src="/assets/shared/email.webp" alt="" />
      </a>
      <h2 className="cards-title">What&apos;s in the cards for us?</h2>
      <div className="playing-cards">
        {site.cards.map((card, index) => {
          const [left, top, width, height] = cardPositions[index];
          return (
            <a
              key={card.href}
              className="playing-card"
              href={card.href}
              aria-label={`${card.number} ${card.title}`}
              style={{ left, top, width, height }}
            >
              <img src={`/assets/cards/${card.asset}.webp`} alt="" />
            </a>
          );
        })}
      </div>
      <img className="pick-doodle" src="/assets/cards/pick.webp" alt="Pick a card, any card!" />
      <img className="social-strip" src="/assets/shared/social.webp" alt="Let's connect" />
      <DevReferenceOverlay src="/@fs/D:/桌面/erbao/how-i-see/dev-references/REF-02-CARDS.png" />
    </ReferenceArtboard>
  );
}
