import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export default function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <main className={`mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 safe-bottom sm:px-6 lg:px-8 ${className}`}>
      {children}
    </main>
  );
}
