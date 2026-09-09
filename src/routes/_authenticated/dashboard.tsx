import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Shell } from "@/components/farmnex/Shell";
import { useAccount } from "@/hooks/useAccount";
import { supabase } from "@/integrations/supabase/client";
import { fetchMyListings, fetchMyOrders } from "@/lib/marketplace";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your FarmNex dashboard — listings & orders" },
      {
        name: "description",
        content:
          "See your published crop lots, the orders buyers have placed, and confirm or complete them from one place.",
      },
      { property: "og:title", content: "Your FarmNex dashboard" },
      { property: "og:description", content: "Track your crop listings and buyer orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const card = "rounded-[1.75rem] bg-surface/70 p-6 ring-1 ring-line/70 backdrop-blur-xl";
const meta = "font-mono text-[10px] uppercase tracking-wider text-muted-foreground";

function Dashboard() {
  const { user, profile, role } = useAccount();
  const queryClient = useQueryClient();

  const listings = useQuery({
    queryKey: ["my-listings", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => fetchMyListings(user!.id),
  });

  const orders = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: Boolean(user?.id),
    queryFn: fetchMyOrders,
  });

  const setOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-payouts"] });
    },
  });

  const payOrder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: "held", paid_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-payouts"] });
    },
  });

  const confirmPickup = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("orders")
        .update({ status: "picked_up", picked_up_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-payouts"] });
    },
  });

  const payLabel: Record<string, string> = {
    unpaid: "payment pending",
    held: "paid · held until pickup",
    released: "released to farmer",
  };


  const closeListing = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("listings").update({ status: "closed" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      queryClient.invalidateQueries({ queryKey: ["open-listings"] });
    },
  });

  const myListingIds = new Set((listings.data ?? []).map((l) => l.id));
  const incoming = (orders.data ?? []).filter((o) => myListingIds.has(o.listing_id));
  const placed = (orders.data ?? []).filter((o) => o.buyer_id === user?.id);

  return (
    <Shell>
      <section className="grid grid-cols-12 gap-5">
        <div className="rise col-span-12">
          <div className={card}>
            <div className={meta}>{role === "buyer" ? "Buyer account" : "Farmer / FPO account"}</div>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              {profile?.full_name || "Welcome"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {[profile?.org, profile?.city, profile?.phone].filter(Boolean).join(" · ") ||
                "Add your details when you list a crop."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/list-crop"
                className="rounded-full bg-leaf px-4 py-2.5 text-sm font-semibold text-surface"
              >
                List a crop
              </Link>
              <Link
                to="/payouts"
                className="rounded-full bg-surface/70 px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-line/70"
              >
                Payouts
              </Link>
              <Link
                to="/"
                className="rounded-full bg-surface/70 px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-line/70"
              >
                Browse listings
              </Link>

            </div>
          </div>
        </div>

        <div className="rise col-span-12 lg:col-span-6" style={{ animationDelay: "60ms" }}>
          <div className={`${card} h-full`}>
            <h2 className="font-display text-lg font-semibold tracking-tight">Your listings</h2>
            {listings.isLoading && <p className="mt-3 text-sm text-muted-foreground">Loading…</p>}
            {!listings.isLoading && (listings.data ?? []).length === 0 && (
              <p className="mt-3 text-sm text-muted-foreground">
                Nothing listed yet. Publish your first lot from “List a crop”.
              </p>
            )}
            <div className="mt-4 space-y-2">
              {(listings.data ?? []).map((l) => (
                <div key={l.id} className="rounded-2xl bg-surface/60 p-3 ring-1 ring-line/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">
                        {l.crop} · {l.quantity_kg.toLocaleString("en-IN")} kg
                      </div>
                      <div className={meta}>
                        {l.city} · harvest {l.harvest_date} · {l.status}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-semibold">₹{Number(l.price_per_kg)}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">/kg</div>
                    </div>
                  </div>
                  {l.status === "open" && (
                    <button
                      onClick={() => closeListing.mutate(l.id)}
                      className="mt-2 rounded-full bg-surface px-3 py-1.5 text-xs font-medium ring-1 ring-line/60"
                    >
                      Mark as sold out
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rise col-span-12 lg:col-span-6" style={{ animationDelay: "120ms" }}>
          <div className={`${card} h-full`}>
            <h2 className="font-display text-lg font-semibold tracking-tight">Orders</h2>
            {orders.isLoading && <p className="mt-3 text-sm text-muted-foreground">Loading…</p>}

            <div className="mt-4">
              <div className={meta}>Orders on your lots</div>
              {incoming.length === 0 && (
                <p className="mt-2 text-sm text-muted-foreground">No buyer orders yet.</p>
              )}
              <div className="mt-2 space-y-2">
                {incoming.map((o) => (
                  <div key={o.id} className="rounded-2xl bg-leaf/10 p-3 ring-1 ring-leaf/25">
                    <div className="text-sm font-semibold">
                      {o.listings?.crop} · {o.quantity_kg.toLocaleString("en-IN")} kg · ₹
                      {Number(o.price_per_kg)}/kg
                    </div>
                    <div className={meta}>
                      {o.status} · ₹{(o.quantity_kg * Number(o.price_per_kg)).toLocaleString("en-IN")}{" "}
                      · {payLabel[o.payment_status] ?? o.payment_status}
                    </div>

                    {o.note && <p className="mt-1 text-sm text-muted-foreground">“{o.note}”</p>}
                    {o.status === "placed" && (
                      <button
                        onClick={() => setOrderStatus.mutate({ id: o.id, status: "confirmed" })}
                        className="mt-2 rounded-full bg-leaf px-3 py-1.5 text-xs font-semibold text-surface"
                      >
                        Confirm order
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className={meta}>Orders you placed</div>
              {placed.length === 0 && (
                <p className="mt-2 text-sm text-muted-foreground">You haven’t ordered anything yet.</p>
              )}
              <div className="mt-2 space-y-2">
                {placed.map((o) => (
                  <div key={o.id} className="rounded-2xl bg-surface/60 p-3 ring-1 ring-line/50">
                    <div className="text-sm font-semibold">
                      {o.listings?.crop} · {o.quantity_kg.toLocaleString("en-IN")} kg · ₹
                      {Number(o.price_per_kg)}/kg
                    </div>
                    <div className={meta}>
                      {o.listings?.city} · {o.status} ·{" "}
                      {payLabel[o.payment_status] ?? o.payment_status}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {o.payment_status === "unpaid" && (
                        <button
                          onClick={() => payOrder.mutate(o.id)}
                          className="rounded-full bg-leaf px-3 py-1.5 text-xs font-semibold text-surface"
                        >
                          Pay ₹
                          {(o.quantity_kg * Number(o.price_per_kg)).toLocaleString("en-IN")} · held
                          till pickup
                        </button>
                      )}
                      {o.payment_status === "held" && o.status !== "picked_up" && (
                        <button
                          onClick={() => confirmPickup.mutate(o.id)}
                          className="rounded-full bg-sun px-3 py-1.5 text-xs font-semibold text-surface"
                        >
                          Confirm pickup & release payment
                        </button>
                      )}
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
