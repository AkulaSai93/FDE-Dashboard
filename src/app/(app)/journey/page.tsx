import type { Metadata } from "next";
import { JourneyView } from "@/components/screens/JourneyView";

export const metadata: Metadata = { title: "My Journey" };

export default function JourneyPage() {
  return <JourneyView />;
}
