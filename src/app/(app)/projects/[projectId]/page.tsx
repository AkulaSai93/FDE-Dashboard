import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS, PROJECT_BY_ID } from "@/data/projects";
import { ProjectDetailView } from "@/components/screens/ProjectDetailView";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ projectId: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ projectId: string }> }): Promise<Metadata> {
  const { projectId } = await params;
  return { title: PROJECT_BY_ID.get(projectId)?.short ?? "Project" };
}

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = PROJECT_BY_ID.get(projectId);
  if (!project) notFound();
  return <ProjectDetailView project={project} />;
}
