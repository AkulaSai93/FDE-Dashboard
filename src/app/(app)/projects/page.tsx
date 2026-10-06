import type { Metadata } from "next";
import { ProjectsView } from "@/components/screens/ProjectsView";
export const metadata: Metadata = { title: "Projects" };
export default function ProjectsPage() { return <ProjectsView />; }
