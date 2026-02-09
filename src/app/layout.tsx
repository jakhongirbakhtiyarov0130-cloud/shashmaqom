import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
    title: "Shashmaqom: Raqamli Meros",
    description: "O‘zbek va tojik xalqlarining nomoddiy madaniy merosi - Shashmaqomning raqamli arxivi.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${playfair.variable} antialiased bg-[#0F172A] text-white min-h-screen relative overflow-x-hidden`}>
                <div className="fixed inset-0 pointer-events-none z-[-1] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0F172A] to-black opacity-80" />
                {children}
            </body>
        </html>
    );
}
