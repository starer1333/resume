import type { Metadata } from "next";
import { AboutScene } from "@/components/AboutScene";

export const metadata: Metadata = {
  title: "About",
  description: "About Wang Jinghan — photographer, writer, and researcher.",
};

export default function AboutPage() {
  return <main><AboutScene /></main>;
}
