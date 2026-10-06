import type { Metadata } from "next";
import { VideosView } from "@/components/screens/VideosView";
export const metadata: Metadata = { title: "Videos" };
export default function VideosPage() { return <VideosView />; }
