import type { Metadata, Viewport } from "next";
import { Inter, Urbanist } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/state/progress";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "FDE Program — Learning Platform",
    template: "%s · FDE Program",
  },
  description:
    "The AI Forward Deployed Engineer learning platform. Curriculum, projects, certification and community for the FDE program by upGrad School of Technology.",
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Dark only. No theme switching, no system preference, no light variant.
    <html lang="en" className={`${inter.variable} ${urbanist.variable}`}>
      <body>
        <ProgressProvider>
          <ToastProvider>{children}</ToastProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
