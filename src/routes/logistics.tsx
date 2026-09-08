import { createFileRoute } from "@tanstack/react-router";

import { Shell } from "@/components/farmnex/Shell";
import { toneChipBg } from "@/components/farmnex/tone";
import { lots, optimisedRoute } from "@/lib/farmnex-data";

export const Route = createFileRoute("/logistics")({
  head: () => ({
    meta: [
      { title: "Route optimisation & delivery tracking — FarmNex" },
      {
        name: "description",
        content:
          "Pooled pickups, an optimised farm-to-buyer route and live delivery tracking that keeps logistics cost per kilo low for farmers and buyers.",
      },
      { property: "og:title", content: "Route optimisation & delivery tracking — FarmNex" },
      {
        property: "og:description",
        content: "Follow today's pooled route and track every lot from farm to buyer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LogisticsPage,
});

const stages = ["Origin", "Collect", "Hub", "Buyer"];

function LogisticsPage() {
  const totalLoad = optimisedRoute[optimisedRoute.length - 1]?.loadKg ?? 0;
  const doneStops = optimisedRoute.filter((s) => s.done).length;

  return (
    <Shell>
      <section className="grid grid-cols-12 gap-5">
        <div className="rise col-span-12">
          <div className="rounded-[1.75rem] bg-gradient-to-br from-sky/20 to-surface/80 p-6 ring-1 ring-line/70 backdrop-blur-xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-sky">
              Logistics engine
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              One truck, many farms, less cost
            </h1>
            <p className="mt-2 max-w-[60ch] text-pretty text-sm text-muted-foreground">
              FarmNex pools nearby pickups into a single optimised run to the hub and on to the
              buyer, so each farmer pays only a small share of the trip.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { k: "Stops today", v: `${doneStops}/${optimisedRoute.length}` },
                { k: "Pooled load", v: `${totalLoad.toLocaleString("en-IN")} kg` },
                { k: "Distance", v: "68 km" },
                { k: "Cost per kg", v: "₹2.80" },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl bg-surface/70 p-3 ring-1 ring-line/60">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {s.k}
                  </div>
                  <div className="mt-1 font-display text-xl font-semibold">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rise col-span-12 lg:col-span-6" style={{ animationDelay: "60ms" }}>
          <div className="h-full rounded-[1.75rem] bg-surface/70 p-6 ring-1 ring-line/70 backdrop-blur-xl">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Optimised route · R-118
            </h2>
            <ol className="mt-5 space-y-1">
              {optimisedRoute.map((stop, i) => (
                <li key={stop.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`grid size-7 place-items-center rounded-full font-mono text-[11px] font-semibold ${
                        stop.done ? "bg-leaf text-surface" : "bg-line/60 text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {i < optimisedRoute.length - 1 && (
                      <span
                        className={`w-0.5 flex-1 ${stop.done ? "bg-leaf/50" : "bg-line/60"}`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="text-sm font-semibold">{stop.label}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">
                      {stop.detail} · {stop.loadKg.toLocaleString("en-IN")} kg on board
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="rise col-span-12 lg:col-span-6" style={{ animationDelay: "120ms" }}>
          <div className="h-full rounded-[1.75rem] bg-surface/70 p-6 ring-1 ring-line/70 backdrop-blur-xl">
            <h2 className="font-display text-lg font-semibold tracking-tight">Live deliveries</h2>
            <div className="mt-4 space-y-3">
              {lots.map((lot) => (
                <div key={lot.id} className="rounded-2xl bg-surface/60 p-4 ring-1 ring-line/50">
                  <div className="flex items-center gap-3">
                    <div
                      className={`grid size-9 place-items-center rounded-xl text-sm font-semibold ${toneChipBg[lot.tone]}`}
                    >
                      {lot.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold">
                        {lot.crop} · {lot.quantityKg.toLocaleString("en-IN")} kg
                      </div>
                      <div className="truncate font-mono text-[11px] text-muted-foreground">
                        {lot.fpo} → {lot.city} · {lot.routeId} · ETA {lot.eta}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    {stages.map((s, i) => (
                      <div key={s} className="flex-1">
                        <div
                          className={`h-1.5 rounded-full ${i <= lot.stage ? "bg-leaf" : "bg-line/60"}`}
                        />
                        <div className="mt-1 font-mono text-[10px] text-muted-foreground">{s}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
