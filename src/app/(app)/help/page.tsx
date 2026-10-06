import type { Metadata } from "next";
import { HelpView } from "@/components/screens/HelpView";
export const metadata: Metadata = { title: "Help" };
export default function HelpPage() { return <HelpView />; }
