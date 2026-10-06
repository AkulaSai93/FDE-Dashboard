import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_TOPICS, TOPIC_BY_ID } from "@/data/curriculum";
import { LearnView } from "@/components/screens/LearnView";

export function generateStaticParams() {
  return ALL_TOPICS.map((t) => ({ topicId: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ topicId: string }> }): Promise<Metadata> {
  const { topicId } = await params;
  return { title: TOPIC_BY_ID.get(topicId)?.title ?? "Lesson" };
}

export default async function LearnPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  const topic = TOPIC_BY_ID.get(topicId);
  if (!topic) notFound();
  return <LearnView topic={topic} />;
}
