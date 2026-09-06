import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import tomatoCrate from "@/assets/tomato-crate.jpg";
import { Shell } from "@/components/farmnex/Shell";
import { toneChipBg, toneSoft } from "@/components/farmnex/tone";
import { forecasts, lots, matchFarmers, recommendPrice } from "@/lib/farmnex-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FarmNex — Farmer to buyer marketplace, no middlemen" },
      {
        name: "description",
        content:
          "FarmNex connects farmers and FPOs directly to consumers and bulk buyers with transparent pricing, demand forecasting and optimised delivery routes.",
      },
      { property: "og:title", content: "FarmNex — Farmer to buyer marketplace, no middlemen" },
      {
        property: "og:description",
        content:
          "Transparent crop prices, AI demand forecasts and route-optimised delivery from farm to buyer.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [selectedId, setSelectedId] = useState(lots[0]!.id);
  const lot = lots.find((l) => l.id === selectedId)!;
  const finalPrice = lot.farmerPrice + lot.logistics;
  const advice = recommendPrice(lot.crop, lot.quantityKg, lot.city);
  const matches = matchFarmers("Onion", 30).slice(0, 2);
  const stages = ["Origin", "Collect", "Hyd Hub", "Buyer"];

  return (
    <Shell>
      <section className="grid grid-cols-12 gap-5">
        <div className="rise col-span-12 lg:col-span-5">
          <div className="rounded-[1.75rem] bg-gradient-to-br from-tomato/25 via-surface/80 to-sun/20 p-6 ring-1 ring-line/70 backdrop-blur-xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-tomato">
              Price breakdown · to buyer
            </div>
            <h1 className="mt-3 text-balance font-display text-[2.4rem] font-semibold leading-[1.05] tracking-tight">
              {lot.crop}, weighed in the open.
            </h1>
            <p className="mt-3 max-w-[34ch] text-pretty text-[15px] leading-relaxed text-muted-foreground">
              Fresh from the {lot.city} mandi. You see every rupee — farmer's cut, logistics, and the
              final price. No hidden trader margin.
            </p>

            <div className="mt-5 rounded-2xl bg-surface/70 p-4 ring-1 ring-line/60">
              <div className="flex items-center justify-between py-1.5">
                <span className="text-sm text-muted-foreground">Farmer / FPO price</span>
                <span className="font-mono text-sm font-medium">₹{lot.farmerPrice} / kg</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-sm text-muted-foreground">Logistics &amp; handling</span>
                <span className="font-mono text-sm font-medium">₹{lot.logistics} / kg</span>
              </div>
              <div className="mt-1 border-t border-line pt-3">
                <div className="flex items-end justify-between">
                  <span className="text-sm font-semibold">Final price</span>
                  <span className="font-display text-3xl font-semibold text-tomato">
                    ₹{finalPrice}
                    <span className="text-base">/kg</span>
                  </span>
                </div>
                <div className="mt-2 flex gap-1.5">
                  <span className="rounded-full bg-leaf/15 px-2.5 py-1 text-xs font-medium text-leaf">
                    Farmer +₹{Math.round(lot.farmerPrice * 0.45)}
                  </span>
                  <span className="rounded-full bg-sky/15 px-2.5 py-1 text-xs font-medium text-sky">
                    You save ₹{lot.retailPrice - finalPrice}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <button className="flex-1 rounded-full bg-ink px-4 py-3 text-sm font-semibold text-surface transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-110">
                Buy this listing
              </button>
              <Link
                to="/forecast"
                className="rounded-full bg-surface/70 px-4 py-3 text-sm font-semibold text-ink ring-1 ring-line/70"
              >
                Compare
              </Link>
            </div>
          </div>
        </div>

        <div className="rise col-span-12 lg:col-span-7" style={{ animationDelay: "60ms" }}>
          <div className="h-full rounded-[1.75rem] bg-surface/70 p-6 ring-1 ring-line/70 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  AI demand forecast
                </div>
                <h2 className="font-display text-xl font-semibold tracking-tight">
                  Current vs predicted · kg / week
                </h2>
              </div>
              <span className="rounded-full bg-tomato/15 px-3 py-1 font-mono text-xs font-medium text-tomato">
                Hyderabad
              </span>
            </div>
            <div className="mt-6 space-y-5">
              {forecasts.slice(0, 3).map((f, i) => {
                const max = 18000;
                return (
                  <div key={f.crop}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{f.crop}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {f.current.toLocaleString("en-IN")} → {f.predicted.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2.5 rounded-full bg-line/60">
                      <div
                        className="bar-grow h-full rounded-full bg-sky/80"
                        style={{ width: `${(f.current / max) * 100}%`, animationDelay: `${i * 80}ms` }}
                      />
                    </div>
                    <div className="mt-1 h-2.5 rounded-full bg-line/60">
                      <div
                        className="bar-grow h-full rounded-full bg-sky"
                        style={{
                          width: `${(f.predicted / max) * 100}%`,
                          animationDelay: `${120 + i * 80}ms`,
                        }}
                      />
                    </div>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 font-mono text-[11px] ${toneSoft[f.tone]}`}
                    >
                      {f.note}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex items-center gap-4 border-t border-line/60 pt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-sky/60" />
                Current
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-sky" />
                Predicted
              </span>
              <span className="ml-auto font-mono">Updated 06:40 IST</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-12 gap-5">
        <div className="rise col-span-12 lg:col-span-4" style={{ animationDelay: "80ms" }}>
          <div className="rounded-[1.75rem] bg-surface/70 p-4 ring-1 ring-line/70 backdrop-blur-xl">
            <div className="flex items-center justify-between px-2 pb-3">
              <h2 className="font-display text-lg font-semibold tracking-tight">Marketplace</h2>
              <span className="font-mono text-xs text-muted-foreground">{lots.length} lots</span>
            </div>
            <div className="space-y-2">
              {lots.map((l) => {
                const active = l.id === selectedId;
                return (
                  <button
                    key={l.id}
                    onClick={() => setSelectedId(l.id)}
                    className={`w-full rounded-2xl p-3 text-left transition-colors ${
                      active
                        ? "bg-tomato/12 ring-1 ring-tomato/25"
                        : "bg-surface/50 ring-1 ring-line/40 hover:bg-surface"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`grid size-9 place-items-center rounded-xl text-sm font-semibold ${toneChipBg[l.tone]}`}
                      >
                        {l.initial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold">{l.crop}</div>
                        <div className="truncate font-mono text-[11px] text-muted-foreground">
                          {l.city} · {l.quantityKg.toLocaleString("en-IN")} kg
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm font-semibold">₹{l.farmerPrice}</div>
                        <div className="font-mono text-[10px] text-muted-foreground">/kg</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rise col-span-12 lg:col-span-8" style={{ animationDelay: "120ms" }}>
          <div className="rounded-[1.75rem] bg-surface/70 p-6 ring-1 ring-line/70 backdrop-blur-xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <img
                src={tomatoCrate}
                alt="Fresh tomatoes in a wooden mandi crate"
                width={1024}
                height={768}
                className="aspect-[4/3] w-full rounded-[1.25rem] object-cover outline-1 -outline-offset-1 outline-line/70"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-tomato/15 px-2.5 py-1 text-xs font-medium text-tomato">
                    {lot.crop}
                  </span>
                  <span className="rounded-full bg-leaf/15 px-2.5 py-1 text-xs font-medium text-leaf">
                    {lot.demand} demand
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">
                  {lot.crop} · {lot.quantityKg.toLocaleString("en-IN")} kg
                </h3>
                <p className="mt-1 font-mono text-sm text-muted-foreground">
                  {lot.fpo} · {lot.city}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-surface/60 p-3 ring-1 ring-line/50">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Quantity
                    </div>
                    <div className="mt-1 font-display text-lg font-semibold">
                      {lot.quantityKg.toLocaleString("en-IN")}
                      <span className="text-xs text-muted-foreground"> kg</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-surface/60 p-3 ring-1 ring-line/50">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Harvest
                    </div>
                    <div className="mt-1 font-display text-lg font-semibold">{lot.harvest}</div>
                  </div>
                  <div className="rounded-2xl bg-surface/60 p-3 ring-1 ring-line/50">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Farmer
                    </div>
                    <div className="mt-1 font-display text-lg font-semibold">
                      ₹{lot.farmerPrice}
                      <span className="text-xs text-muted-foreground">/kg</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-gradient-to-r from-leaf/12 to-sky/12 p-4 ring-1 ring-line/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Delivery</span>
                    <span className="font-mono text-[11px] text-muted-foreground">ETA {lot.eta}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-1">
                    {stages.map((s, i) => (
                      <div key={s} className="contents">
                        {i > 0 && <div className="h-1 flex-1 rounded-full bg-line" />}
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={
                              i < lot.stage
                                ? "size-3 rounded-full bg-leaf ring-4 ring-leaf/20"
                                : i === lot.stage
                                  ? "nudge size-3 rounded-full bg-tomato"
                                  : "size-3 rounded-full bg-surface ring-2 ring-line"
                            }
                          />
                          <span
                            className={`font-mono text-[9px] ${i === lot.stage ? "text-tomato" : "text-muted-foreground"}`}
                          >
                            {s}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono">Route {lot.routeId} · 4 stops</span>
                    <span className="rounded-full bg-tomato/15 px-2 py-0.5 font-medium text-tomato">
                      In transit
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-12 gap-5">
        <div className="rise col-span-12 lg:col-span-5" style={{ animationDelay: "160ms" }}>
          <div className="h-full rounded-[1.75rem] bg-gradient-to-br from-sun/20 to-surface/80 p-6 ring-1 ring-line/70 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold tracking-tight">
                Fair-price recommendation
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Farmer
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-surface/60 p-3 ring-1 ring-line/50">
                <span className="text-sm text-muted-foreground">Market range</span>
                <span className="font-mono text-sm font-medium">
                  ₹{advice.low} – ₹{advice.high} / kg
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-surface/60 p-3 ring-1 ring-line/50">
                <span className="text-sm text-muted-foreground">Predicted demand</span>
                <span className="rounded-full bg-tomato/15 px-2.5 py-0.5 text-xs font-medium text-tomato">
                  {advice.demand}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-surface/60 p-3 ring-1 ring-line/50">
                <span className="text-sm text-muted-foreground">Potential buyers</span>
                <span className="font-mono text-sm font-medium">{advice.buyers} active</span>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-leaf/12 p-4 ring-1 ring-leaf/25">
              <div className="font-mono text-[10px] uppercase tracking-wider text-leaf">
                Recommended price
              </div>
              <div className="mt-1 font-display text-3xl font-semibold text-leaf">
                ₹{advice.recommended}
                <span className="text-base">/kg</span>
              </div>
              <Link
                to="/list-crop"
                className="mt-3 block w-full rounded-full bg-leaf px-4 py-2.5 text-center text-sm font-semibold text-surface transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-105"
              >
                List at fair price
              </Link>
            </div>
          </div>
        </div>

        <div className="rise col-span-12 lg:col-span-7" style={{ animationDelay: "200ms" }}>
          <div className="h-full rounded-[1.75rem] bg-surface/70 p-6 ring-1 ring-line/70 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold tracking-tight">
                Bulk-buyer requirement board
              </h3>
              <Link
                to="/bulk-board"
                className="rounded-full bg-sky/15 px-3 py-1.5 text-xs font-semibold text-sky"
              >
                Post
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 rounded-2xl bg-surface/60 p-3 ring-1 ring-line/50">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Crop
                </div>
                <div className="mt-1 text-sm font-semibold">Onion</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Qty
                </div>
                <div className="mt-1 font-mono text-sm font-medium">5,000 kg</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Deliver
                </div>
                <div className="mt-1 font-mono text-sm font-medium">12 Sep</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Max
                </div>
                <div className="mt-1 font-mono text-sm font-medium">₹30/kg</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Matched farmers
              </div>
              <div className="mt-2 space-y-2">
                {matches.map((m, i) => (
                  <div
                    key={m.name}
                    className="flex items-center gap-3 rounded-2xl bg-surface/50 p-3 ring-1 ring-line/40"
                  >
                    <div
                      className={`grid size-9 place-items-center rounded-xl text-sm font-semibold ${
                        i === 0 ? toneChipBg["sun"] : toneChipBg["sky"]
                      }`}
                    >
                      {m.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold">{m.name}</div>
                      <div className="truncate font-mono text-[11px] text-muted-foreground">
                        {m.city} · {m.distanceKm} km
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        i === 0 ? "bg-leaf/15 text-leaf" : "bg-sky/15 text-sky"
                      }`}
                    >
                      {m.match}% match
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
