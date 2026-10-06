import { Suspense } from "react";
import type { Metadata } from "next";
import { CurriculumView } from "@/components/screens/CurriculumView";

export const metadata: Metadata = { title: "Curriculum" };

export default function CurriculumPage() {
  return (
    <Suspense fallback={null}>
      <CurriculumView />
    </Suspense>
  );
}
