import type { Metadata } from "next";
import { NotesView } from "@/components/screens/NotesView";
export const metadata: Metadata = { title: "Notes" };
export default function NotesPage() { return <NotesView />; }
