import { createFileRoute } from "@tanstack/react-router";

import { Shell } from "@/components/farmnex/Shell";
import { toneSoft, toneText } from "@/components/farmnex/tone";
import { forecasts, lots } from "@/lib/farmnex-data";

export const Route = createFileRoute("/forecast")({
  head: () => ({
    meta: [
      { title: "Crop demand forecast — FarmNex" },
      {
        name: "description",
        content:
          "Week-ahead demand forecast for tomato, onion, potato and cauliflower so farmers can plan harvests and pricing with confidence.",
      },
      { property: "og:title", content: "Crop demand forecast — FarmNex" },
      {
        property: "og:description",
        content: "See predicted demand per crop and plan your harvest before prices move.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForecastPage,
});

function ForecastPage() {
  const maxValue = Math.max(...forecasts.flatMap((f) => [f.current, f.predicted]));

  return (
    <Shell>
      <section className="grid grid-cols-12 gap-5">
        <div className="rise col-span-12">
          <div className="rounded-[1.75rem] bg-gradient-to-br from-sun/20 to-surface/80 p-6 ring-1 ring-line/70 backdrop-blur-xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-tomato">
              Demand forecast
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              What buyers will want next week
            </h1>
            <p className="mt-2 max-w-[60ch] text-pretty text-sm text-muted-foreground">
              FarmNex compares this week&rsquo;s buyer orders with seasonal and festival patterns to
              estimate demand seven days ahead, so you can time the harvest and set a fair price.
            </p>
          </div>
        </div>

        <div className="rise col-span-12 lg:col-span-7" style={{ animationDelay: "60ms" }}>
          <div className="h-full rounded-[1.75rem] bg-surface/70 p-6 ring-1 ring-line/70 backdrop-blur-xl">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              This week vs next week (kg)
            </h2>
            <div className="mt-5 space-y-5">
              {forecasts.map((f) => {
                const delta = f.predicted - f.current;
                return (
                  <div key={f.crop}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{f.crop}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${toneSoft[f.tone]}`}
                      >
                        {f.note}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="w-16 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Now
                        </span>
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-line/50">
                          <div
                            className="h-full rounded-full bg-ink/25"
                            style={{ width: `${(f.current / maxValue) * 100}%` }}
                          />
                        </div>
                        <span className="w-20 text-right font-mono text-xs">
                          {f.current.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-16 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Next
                        </span>
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-line/50">
                          <div
                            className="h-full rounded-full bg-leaf"
                            style={{ width: `${(f.predicted / maxValue) * 100}%` }}
                          />
                        </div>
                        <span className="w-20 text-right font-mono text-xs font-medium">
                          {f.predicted.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                      {delta >= 0 ? "+" : ""}
                      {delta.toLocaleString("en-IN")} kg expected movement
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rise col-span-12 lg:col-span-5" style={{ animationDelay: "120ms" }}>
          <div className="h-full rounded-[1.75rem] bg-surface/70 p-6 ring-1 ring-line/70 backdrop-blur-xl">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              What this means for your lots
            </h2>
            <div className="mt-4 space-y-2">
              {lots.map((lot) => {
                const f = forecasts.find((x) => x.crop === lot.crop);
                return (
                  <div
                    key={lot.id}
                    className="rounded-2xl bg-surface/60 p-3 ring-1 ring-line/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {lot.crop} · {lot.fpo}
                      </span>
                      <span className={`font-mono text-xs ${toneText[lot.tone]}`}>{lot.id}</span>
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                      {lot.quantityKg.toLocaleString("en-IN")} kg · harvest {lot.harvest} ·{" "}
                      {f ? f.note : "steady"}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {f && f.predicted > f.current
                        ? "Hold a few days — demand is rising, prices should firm up."
                        : "Sell soon — demand is easing next week."}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
