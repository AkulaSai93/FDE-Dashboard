import type { Metadata } from "next";
import { UnlockedView } from "@/components/screens/UnlockedView";

export const metadata: Metadata = { title: "Welcome to the FDE Platform" };

export default function UnlockedPage() {
  return <UnlockedView />;
}
