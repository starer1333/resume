import type { Metadata } from "next";
import { UnfinishedScene } from "@/components/UnfinishedScene";
export const metadata: Metadata = { title: "Finished / Unfinished", description: "Completed works and ideas still becoming." };
export default function UnfinishedPage() { return <main><UnfinishedScene /></main>; }
