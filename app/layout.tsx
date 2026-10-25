import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({
    variable: "--font-instrument",
    weight: "400",
    subsets: ["latin"],
});
export const metadata: Metadata = {
    title: "CMS Portofolio",
    description: "Panel admin portofolio Carles Marvin.",
};
export default function RootLayout({ children }: LayoutProps<"/">) {
    return (<html lang="id" className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>);
}
