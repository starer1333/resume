import type { Metadata } from "next";
import { CardsScene } from "@/components/CardsScene";
import { HomeScene } from "@/components/HomeScene";

export const metadata: Metadata = {
  title: "How I See — Wang Jinghan",
  description: "Observing, feeling, remembering — a personal portfolio by Wang Jinghan.",
};

export default function Home() {
  return (
    <main>
      <HomeScene />
      <CardsScene />
    </main>
  );
}
