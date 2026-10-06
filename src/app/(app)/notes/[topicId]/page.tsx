import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_TOPICS, TOPIC_BY_ID } from "@/data/curriculum";
import { NotePageView } from "@/components/screens/NotePageView";

export function generateStaticParams() {
  return ALL_TOPICS.map((t) => ({ topicId: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ topicId: string }> }): Promise<Metadata> {
  const { topicId } = await params;
  const t = TOPIC_BY_ID.get(topicId);
  return { title: t ? `${t.title} — Notes` : "Notes" };
}

export default async function NotePage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  const topic = TOPIC_BY_ID.get(topicId);
  if (!topic) notFound();
  return <NotePageView topic={topic} />;
}
