import type { Metadata, Viewport } from "next";
import { Inter, Urbanist } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/state/progress";
import { ToastProvider } from "@/components/ui/toast";
import { THEME_SCRIPT, ThemeProvider } from "@/state/theme";

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
  // Both themes are supported; the browser chrome colour follows whichever the
  // learner has chosen.
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#e9ebef" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below sets data-theme on this
    // element before React hydrates, so the server's value is expected to differ.
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${urbanist.variable}`}
    >
      <head>
        {/* Runs before first paint so the stored theme is applied with no flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>
          <ProgressProvider>
            <ToastProvider>{children}</ToastProvider>
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
