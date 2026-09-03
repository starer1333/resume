import type { Metadata } from "next";
import { ObserveScene } from "@/components/ObserveScene";
export const metadata: Metadata = { title: "Observe '26", description: "An interactive ring of photographic observations." };
export default function ObservePage() { return <main><ObserveScene /></main>; }
