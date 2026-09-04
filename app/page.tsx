import type { Metadata } from "next";
import { CardsScene } from "@/components/CardsScene";
import { HomeScene } from "@/components/HomeScene";

export const metadata: Metadata = {
  title: "Jinghan — Personal Archive",
  description: "A personal field note in sound, image, and memory.",
};

export default function Home() {
  return (
    <main className="home-flow">
      <HomeScene />
      <CardsScene />
    </main>
  );
}