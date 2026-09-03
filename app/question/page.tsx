import type { Metadata } from "next";
import { QuestionScene } from "@/components/QuestionScene";
export const metadata: Metadata = { title: "Question", description: "A spatial research canvas of questions, notes, and observations." };
export default function QuestionPage() { return <main><QuestionScene /></main>; }
