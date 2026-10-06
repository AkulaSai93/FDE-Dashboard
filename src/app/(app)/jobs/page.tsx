import type { Metadata } from "next";
import { JobsView } from "@/components/screens/JobsView";
export const metadata: Metadata = { title: "Job Portal" };
export default function JobsPage() { return <JobsView />; }
