import type { Metadata } from "next";
import { MakePostcardScene } from "@/components/MakePostcardScene";
export const metadata: Metadata = { title: "Make — Postcard", description: "Selected creative work arranged on a vintage postcard." };
export default function MakePostcardPage() { return <main><MakePostcardScene /></main>; }
