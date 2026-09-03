"use client";

import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { DevReferenceOverlay } from "./DevReferenceOverlay";
import { ReferenceArtboard } from "./ReferenceArtboard";
import { SiteNav } from "./SiteNav";

const scraps = [
  ["keep-note", 106, 114, 213, 242], ["green-question", 318, 138, 154, 165],
  ["window", 36, 290, 154, 171], ["venn", 224, 353, 226, 226],
  ["research-log", 460, 314, 178, 244], ["field-note", 52, 487, 156, 188],
  ["landscape", 115, 572, 194, 177], ["portrait", 429, 564, 174, 201],
  ["small-question", 281, 673, 137, 159], ["big-question", 692, 395, 249, 199],
  ["stamp", 954, 386, 97, 120], ["embroidery", 748, 603, 158, 184],
  ["filmstrip", 934, 556, 107, 270], ["abstract", 584, 718, 292, 185],
  ["home-note", 1120, 108, 185, 194], ["desk", 1317, 129, 201, 189],
  ["unanswered", 1061, 317, 228, 232], ["chart", 1283, 362, 235, 214],
  ["flower", 1489, 324, 149, 259], ["good-questions", 1059, 551, 230, 171],
  ["progress", 1283, 620, 127, 123], ["question-lab", 1406, 620, 189, 229],
  ["meadow", 1066, 727, 246, 180],
] as const;

export function QuestionScene() {
  return (
    <ReferenceArtboard className="paper-stage question-stage">
      <TransformWrapper initialScale={1} initialPositionX={0} initialPositionY={0} minScale={0.72} maxScale={1.8} centerOnInit={false} limitToBounds={false} smooth wheel={{ step: 0.08 }}>
        <TransformComponent wrapperClass="question-viewport" contentClass="question-canvas" wrapperStyle={{ width: "1672px", height: "941px" }} contentStyle={{ width: "2600px", height: "1700px" }}>
          <div className="question-reference-area">
            <SiteNav />
            <a className="email-doodle" href="mailto:hello@example.com" aria-label="Email Wang Jinghan"><img src="/assets/shared/email.webp" alt="" /></a>
            <header className="question-heading">
              <h1>Question</h1>
              <p>I don&apos;t have the answers yet.<br />But I keep asking better questions.</p>
              <span aria-hidden="true">♡</span>
            </header>
            {scraps.map(([name, left, top, width, height]) => (
              <img key={name} className="collage-piece" src={`/assets/question/${name}.webp`} alt="" aria-hidden="true" style={{ left, top, width, height }} />
            ))}
            <img className="scroll-doodle question-scroll" src="/assets/shared/scroll.webp" alt="Scroll down" />
            <p className="question-more">more to explore ⟶*</p>
            <DevReferenceOverlay src="/@fs/D:/桌面/erbao/how-i-see/dev-references/REF-08-QUESTION.png" />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </ReferenceArtboard>
  );
}
