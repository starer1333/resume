import type { Metadata } from "next";
import { NotesScene } from "@/components/NotesScene";
export const metadata: Metadata = { title: "Notes", description: "Four framed notes from the archive." };
export default function NotesPage() { return <main><NotesScene /></main>; }
