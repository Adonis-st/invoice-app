import "./globals.css";
import { type Metadata } from "next";
import { League_Spartan } from "next/font/google";

export const metadata: Metadata = {
  title: "Invoice App",
  description: "Invoice App",
  //   icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={leagueSpartan.className}>
      <body className="bg-snow dark:bg-[#141625]">{children}</body>
    </html>
  );
}
