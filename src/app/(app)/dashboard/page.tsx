import type { Metadata } from "next";
import { DashboardView } from "@/components/screens/DashboardView";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <DashboardView />;
}
