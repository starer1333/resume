import type { Metadata } from "next";
import { MakeScene } from "@/components/MakeScene";
export const metadata: Metadata = { title: "Make", description: "Selected creative work arranged as a handmade newspaper." };
export default function MakePage() { return <main><MakeScene /></main>; }
