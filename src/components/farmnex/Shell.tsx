import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const navItems = [
  { to: "/", label: "Marketplace" },
  { to: "/list-crop", label: "List a crop" },
  { to: "/bulk-board", label: "Bulk board" },
  { to: "/forecast", label: "Forecast" },
  { to: "/logistics", label: "Logistics" },
  { to: "/payouts", label: "Payouts" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas font-body text-ink">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-16 size-96 rounded-full bg-tomato/10 blur-3xl" />
        <div className="absolute top-40 -right-20 size-[28rem] rounded-full bg-sky/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-80 rounded-full bg-leaf/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-5 pb-16">
        <header className="sticky top-0 z-30 -mx-5 mb-8 border-b border-line/60 bg-surface/60 px-5 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-2xl bg-leaf font-display text-lg font-semibold text-surface">
                F
              </div>
              <div className="leading-none">
                <div className="font-display text-lg font-semibold tracking-tight">FarmNex</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  mandi · transparent
                </div>
              </div>
            </Link>
            <nav className="ml-auto hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-ink"
                  activeProps={{ className: "bg-leaf/15 text-ink" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2 md:ml-0">
              <Link
                to="/bulk-board"
                className="rounded-full bg-leaf px-4 py-2 text-sm font-semibold text-surface transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-105"
              >
                Post requirement
              </Link>
              <div className="grid size-9 place-items-center rounded-full bg-tomato/15 font-mono text-xs font-medium text-tomato">
                HS
              </div>
            </div>
          </div>
        </header>

        {children}

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-5 text-muted-foreground">
          <span className="font-mono text-xs">FarmNex · fair mandi, transparent prices</span>
          <span className="font-mono text-xs">Hyderabad · Hyderabad Hub · 4 active routes</span>
        </footer>
      </div>
    </div>
  );
}
