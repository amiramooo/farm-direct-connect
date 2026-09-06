import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Shell } from "@/components/farmnex/Shell";
import { toneChipBg } from "@/components/farmnex/tone";
import { matchFarmers } from "@/lib/farmnex-data";

export const Route = createFileRoute("/bulk-board")({
  head: () => ({
    meta: [
      { title: "Bulk buyer requirement board — FarmNex" },
      {
        name: "description",
        content:
          "Restaurants, hotels, supermarkets and processors post bulk crop requirements on FarmNex and get matched with nearby farmers and FPOs.",
      },
      { property: "og:title", content: "Bulk buyer requirement board — FarmNex" },
      {
        property: "og:description",
        content: "Post a bulk requirement and see matched farmers and FPOs instantly.",
      },
    ],
  }),
  component: BulkBoard,
});

const openRequirements = [
  { buyer: "Paradise Kitchens", crop: "Onion", qty: 5000, deliver: "12 Sep", max: 30, tone: "sun" },
  { buyer: "FreshMart Retail", crop: "Tomato", qty: 3000, deliver: "13 Sep", max: 32, tone: "tomato" },
  { buyer: "Deccan Foods Ltd", crop: "Potato", qty: 12000, deliver: "16 Sep", max: 21, tone: "leaf" },
];

function BulkBoard() {
  const [crop, setCrop] = useState("Onion");
  const [qty, setQty] = useState(5000);
  const [city, setCity] = useState("Hyderabad");
  const [deliver, setDeliver] = useState("2026-09-12");
  const [maxPrice, setMaxPrice] = useState(30);

  const matches = useMemo(() => matchFarmers(crop, maxPrice), [crop, maxPrice]);

  const field =
    "mt-1 w-full rounded-2xl bg-surface/70 px-4 py-2.5 text-sm ring-1 ring-line/60 outline-none focus:ring-sky/50";
  const label = "font-mono text-[10px] uppercase tracking-wider text-muted-foreground";

  return (
    <Shell>
      <section className="grid grid-cols-12 gap-5">
        <div className="rise col-span-12 lg:col-span-5">
          <div className="rounded-[1.75rem] bg-gradient-to-br from-sky/20 to-surface/80 p-6 ring-1 ring-line/70 backdrop-blur-xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-sky">
              Bulk buyer
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              Post a requirement
            </h1>
            <p className="mt-2 text-pretty text-sm text-muted-foreground">
              Hotels, supermarkets, processors and wholesalers tell FarmNex what they need. We match
              nearby farmers and FPOs who can fill it.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <div className={label}>Crop</div>
                <select className={field} value={crop} onChange={(e) => setCrop(e.target.value)}>
                  {["Onion", "Tomato", "Potato", "Cauliflower"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className={label}>Quantity (kg)</div>
                  <input
                    type="number"
                    className={field}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                  />
                </div>
                <div>
                  <div className={label}>Delivery by</div>
                  <input
                    type="date"
                    className={field}
                    value={deliver}
                    onChange={(e) => setDeliver(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className={label}>Location</div>
                  <input className={field} value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div>
                  <div className={label}>Max price (₹/kg)</div>
                  <input
                    type="number"
                    className={field}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-surface/70 p-4 ring-1 ring-line/60">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Budget ceiling</span>
                <span className="font-mono font-medium">
                  ₹{(qty * maxPrice).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Farmers who can fill it</span>
                <span className="font-mono font-medium">{matches.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rise col-span-12 lg:col-span-7" style={{ animationDelay: "60ms" }}>
          <div className="rounded-[1.75rem] bg-surface/70 p-6 ring-1 ring-line/70 backdrop-blur-xl">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Matched farmers &amp; FPOs
            </h2>
            <div className="mt-4 space-y-2">
              {matches.length === 0 && (
                <p className="rounded-2xl bg-sun/20 p-4 text-sm text-ink/70">
                  No farmer can supply {crop} at ₹{maxPrice}/kg right now. Raise your ceiling to see
                  matches.
                </p>
              )}
              {matches.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center gap-3 rounded-2xl bg-surface/50 p-3 ring-1 ring-line/40"
                >
                  <div
                    className={`grid size-10 place-items-center rounded-xl text-sm font-semibold ${toneChipBg["leaf"]}`}
                  >
                    {m.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{m.name}</div>
                    <div className="truncate font-mono text-[11px] text-muted-foreground">
                      {m.city} · {m.distanceKm} km · ₹{m.price}/kg
                    </div>
                  </div>
                  <span className="rounded-full bg-leaf/15 px-2.5 py-1 text-xs font-medium text-leaf">
                    {m.match}% match
                  </span>
                  <button className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold text-surface">
                    Invite
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-line/60 pt-5">
              <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Open requirements from other buyers
              </h3>
              <div className="mt-3 space-y-2">
                {openRequirements.map((r) => (
                  <div
                    key={r.buyer}
                    className="grid grid-cols-5 items-center gap-2 rounded-2xl bg-surface/60 p-3 ring-1 ring-line/50"
                  >
                    <div className="col-span-2 text-sm font-semibold">{r.buyer}</div>
                    <div className="font-mono text-xs text-muted-foreground">{r.crop}</div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {r.qty.toLocaleString("en-IN")} kg
                    </div>
                    <div className="text-right font-mono text-xs font-medium">
                      ₹{r.max}/kg · {r.deliver}
                    </div>
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
