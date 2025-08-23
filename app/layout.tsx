import "./global.css";
import Link from "next/link";

export const runtime = "edge";

export default function RootLayout({ children }) {
  return (
    <html>
      <head />
      <body suppressHydrationWarning className="dark min-h-screen">
        <main className="text-white flex min-h-screen flex-col items-center justify-between p-4 pt-24 md:p-24 h-full bg-black">
          <div className="z-10 w-full h-full max-w-5xl items-center justify-between font-mono text-sm">
            <Link
              href="/"
              className="z-[10] fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit"
            >
              Go home
            </Link>

            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
