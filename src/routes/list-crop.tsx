import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Shell } from "@/components/farmnex/Shell";
import { recommendPrice } from "@/lib/farmnex-data";

export const Route = createFileRoute("/list-crop")({
  head: () => ({
    meta: [
      { title: "List a crop with a fair price — FarmNex" },
      {
        name: "description",
        content:
          "Farmers and FPOs list crops on FarmNex and get a fair-price recommendation based on market range, predicted demand and active buyers.",
      },
      { property: "og:title", content: "List a crop with a fair price — FarmNex" },
      {
        property: "og:description",
        content: "Get a recommended selling price before you list your harvest.",
      },
    ],
  }),
  component: ListCrop,
});

const crops = ["Tomato", "Onion", "Potato", "Cauliflower"];

function ListCrop() {
  const [crop, setCrop] = useState("Tomato");
  const [quantity, setQuantity] = useState(2000);
  const [city, setCity] = useState("Hyderabad");
  const [harvest, setHarvest] = useState("2026-09-10");
  const [askPrice, setAskPrice] = useState(26);
  const [listed, setListed] = useState(false);

  const advice = useMemo(() => recommendPrice(crop, quantity, city), [crop, quantity, city]);
  const verdict =
    askPrice > advice.high
      ? { text: "Above market — buyers may skip", cls: "bg-tomato/15 text-tomato" }
      : askPrice < advice.low
        ? { text: "Below market — you are losing value", cls: "bg-sun/25 text-ink/70" }
        : { text: "Inside the fair band", cls: "bg-leaf/15 text-leaf" };

  const field =
    "mt-1 w-full rounded-2xl bg-surface/70 px-4 py-2.5 text-sm ring-1 ring-line/60 outline-none focus:ring-leaf/50";
  const label = "font-mono text-[10px] uppercase tracking-wider text-muted-foreground";

  return (
    <Shell>
      <section className="grid grid-cols-12 gap-5">
        <div className="rise col-span-12 lg:col-span-7">
          <div className="rounded-[1.75rem] bg-surface/70 p-6 ring-1 ring-line/70 backdrop-blur-xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-leaf">
              Farmer / FPO
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              List your harvest
            </h1>
            <p className="mt-2 max-w-[46ch] text-pretty text-sm text-muted-foreground">
              Tell us what you have. FarmNex checks the live mandi band and predicted demand before
              you commit to a price.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className={label}>Crop</div>
                <select className={field} value={crop} onChange={(e) => setCrop(e.target.value)}>
                  {crops.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className={label}>Quantity (kg)</div>
                <input
                  type="number"
                  min={1}
                  className={field}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              <div>
                <div className={label}>Location</div>
                <input className={field} value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div>
                <div className={label}>Harvest date</div>
                <input
                  type="date"
                  className={field}
                  value={harvest}
                  onChange={(e) => setHarvest(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <div className={label}>Your asking price (₹/kg)</div>
                <input
                  type="range"
                  min={10}
                  max={40}
                  value={askPrice}
                  onChange={(e) => setAskPrice(Number(e.target.value))}
                  className="mt-3 w-full accent-[var(--leaf)]"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-display text-2xl font-semibold">₹{askPrice}/kg</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${verdict.cls}`}>
                    {verdict.text}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setListed(true)}
              className="mt-6 w-full rounded-full bg-leaf px-4 py-3 text-sm font-semibold text-surface transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-105"
            >
              Publish listing
            </button>
            {listed && (
              <p className="mt-3 rounded-2xl bg-leaf/12 p-3 text-sm text-leaf ring-1 ring-leaf/25">
                Listed: {quantity.toLocaleString("en-IN")} kg {crop} from {city} at ₹{askPrice}/kg.
                {advice.buyers} buyers have been notified.
              </p>
            )}
          </div>
        </div>

        <div className="rise col-span-12 lg:col-span-5" style={{ animationDelay: "60ms" }}>
          <div className="h-full rounded-[1.75rem] bg-gradient-to-br from-sun/20 to-surface/80 p-6 ring-1 ring-line/70 backdrop-blur-xl">
            <h2 className="font-display text-lg font-semibold tracking-tight">Price intelligence</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-surface/60 p-3 ring-1 ring-line/50">
                <span className="text-sm text-muted-foreground">Current market range</span>
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
              <div className="flex items-center justify-between rounded-2xl bg-surface/60 p-3 ring-1 ring-line/50">
                <span className="text-sm text-muted-foreground">Estimated lot value</span>
                <span className="font-mono text-sm font-medium">
                  ₹{(askPrice * quantity).toLocaleString("en-IN")}
                </span>
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
              <button
                onClick={() => setAskPrice(advice.recommended)}
                className="mt-3 w-full rounded-full bg-leaf px-4 py-2.5 text-sm font-semibold text-surface transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-105"
              >
                Use this price
              </button>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
