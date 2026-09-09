import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Shell } from "@/components/farmnex/Shell";
import { useAccount } from "@/hooks/useAccount";
import { supabase } from "@/integrations/supabase/client";
import { fetchMyPayouts } from "@/lib/marketplace";

export const Route = createFileRoute("/_authenticated/payouts")({
  head: () => ({
    meta: [
      { title: "Payouts — money owed to you on FarmNex" },
      {
        name: "description",
        content:
          "See buyer payments held against your crop lots, what has been released after pickup, and everything already settled into your account.",
      },
      { property: "og:title", content: "FarmNex payouts" },
      {
        property: "og:description",
        content: "Track held, released and settled payments for your crop lots.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Payouts,
});

const card = "rounded-[1.75rem] bg-surface/70 p-6 ring-1 ring-line/70 backdrop-blur-xl";
const meta = "font-mono text-[10px] uppercase tracking-wider text-muted-foreground";

const rupees = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

function Payouts() {
  const { user } = useAccount();
  const queryClient = useQueryClient();

  const payouts = useQuery({
    queryKey: ["my-payouts", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => fetchMyPayouts(user!.id),
  });

  const settle = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("payouts")
        .update({ status: "settled", settled_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-payouts"] }),
  });

  const rows = payouts.data ?? [];
  const total = (status: string) =>
    rows.filter((p) => p.status === status).reduce((sum, p) => sum + Number(p.amount), 0);

  const stats = [
    { label: "Held until pickup", value: total("held"), tone: "text-sun" },
    { label: "Released to you", value: total("released"), tone: "text-leaf" },
    { label: "Settled", value: total("settled"), tone: "text-sky" },
  ];

  return (
    <Shell>
      <section className="grid grid-cols-12 gap-5">
        <div className="rise col-span-12">
          <div className={card}>
            <div className={meta}>Payout dashboard</div>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Your money</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Buyers pay when they order. The money stays on hold until they confirm pickup, then it
              is released to you.
            </p>
            <Link
              to="/dashboard"
              className="mt-5 inline-block rounded-full bg-surface/70 px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-line/70"
            >
              Back to dashboard
            </Link>
          </div>
        </div>

        {stats.map((s, i) => (
          <div
            key={s.label}
            className="rise col-span-12 md:col-span-4"
            style={{ animationDelay: `${60 + i * 50}ms` }}
          >
            <div className={`${card} h-full`}>
              <div className={meta}>{s.label}</div>
              <div className={`mt-2 font-mono text-2xl font-semibold ${s.tone}`}>
                {rupees(s.value)}
              </div>
            </div>
          </div>
        ))}

        <div className="rise col-span-12" style={{ animationDelay: "220ms" }}>
          <div className={card}>
            <h2 className="font-display text-lg font-semibold tracking-tight">Payment history</h2>
            {payouts.isLoading && <p className="mt-3 text-sm text-muted-foreground">Loading…</p>}
            {!payouts.isLoading && rows.length === 0 && (
              <p className="mt-3 text-sm text-muted-foreground">
                No payments yet. They appear here as soon as a buyer pays for one of your lots.
              </p>
            )}
            <div className="mt-4 space-y-2">
              {rows.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface/60 p-3 ring-1 ring-line/50"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">
                      {p.orders?.listings?.crop ?? "Crop lot"} ·{" "}
                      {(p.orders?.quantity_kg ?? 0).toLocaleString("en-IN")} kg
                    </div>
                    <div className={meta}>
                      {p.orders?.listings?.city ?? "—"} · {p.status}
                      {p.released_at ? ` · released ${p.released_at.slice(0, 10)}` : ""}
                      {p.settled_at ? ` · settled ${p.settled_at.slice(0, 10)}` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-sm font-semibold">{rupees(Number(p.amount))}</div>
                    {p.status === "released" && (
                      <button
                        onClick={() => settle.mutate(p.id)}
                        className="rounded-full bg-leaf px-3 py-1.5 text-xs font-semibold text-surface"
                      >
                        Mark as received
                      </button>
                    )}
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
