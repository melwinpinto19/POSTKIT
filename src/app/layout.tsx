"use client";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

import { Poppins } from "next/font/google";

// Load Poppins font with selected weights and subsets
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Add weights as needed
  display: "swap",
  variable: "--font-poppins", // optional if using CSS variables
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning className={poppins.className}>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
