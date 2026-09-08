import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Shell } from "@/components/farmnex/Shell";
import { useSession, type Role } from "@/hooks/useAccount";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Create your FarmNex account — farmers & buyers" },
      {
        name: "description",
        content:
          "Sign up as a farmer to list crops, or as a buyer to order directly from farms. Log in to manage your listings and orders on FarmNex.",
      },
      { property: "og:title", content: "Create your FarmNex account" },
      {
        property: "og:description",
        content: "Farmers list crops, buyers place orders — directly, with transparent prices.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const field =
  "mt-1 w-full rounded-2xl bg-surface/70 px-4 py-2.5 text-sm ring-1 ring-line/60 outline-none focus:ring-leaf/50";
const label = "font-mono text-[10px] uppercase tracking-wider text-muted-foreground";

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [role, setRole] = useState<Role>("farmer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [org, setOrg] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/dashboard", replace: true });
  }, [loading, session, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName, org, city, phone, role },
          },
        });
        if (signUpError) throw signUpError;
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <section className="grid grid-cols-12 gap-5">
        <div className="rise col-span-12 lg:col-span-7">
          <div className="rounded-[1.75rem] bg-surface/70 p-6 ring-1 ring-line/70 backdrop-blur-xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-leaf">
              {mode === "signup" ? "New account" : "Welcome back"}
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              {mode === "signup" ? "Join FarmNex" : "Log in to FarmNex"}
            </h1>
            <p className="mt-2 max-w-[46ch] text-pretty text-sm text-muted-foreground">
              Farmers and FPOs list harvests. Buyers order straight from the farm. No middlemen in
              between.
            </p>

            <div className="mt-5 inline-flex rounded-full bg-surface/60 p-1 ring-1 ring-line/60">
              {(["signup", "login"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    mode === m ? "bg-leaf text-surface" : "text-muted-foreground hover:text-ink"
                  }`}
                >
                  {m === "signup" ? "Sign up" : "Log in"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {mode === "signup" && (
                <div className="sm:col-span-2">
                  <div className={label}>I am a</div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(["farmer", "buyer"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`rounded-2xl px-4 py-3 text-left text-sm ring-1 transition-colors ${
                          role === r
                            ? "bg-leaf/15 ring-leaf/40"
                            : "bg-surface/50 ring-line/50 hover:bg-surface"
                        }`}
                      >
                        <div className="font-semibold">{r === "farmer" ? "Farmer / FPO" : "Buyer"}</div>
                        <div className="font-mono text-[11px] text-muted-foreground">
                          {r === "farmer" ? "List crops, receive orders" : "Order lots from farms"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={mode === "signup" ? "" : "sm:col-span-2"}>
                <div className={label}>Email</div>
                <input
                  type="email"
                  required
                  className={field}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={mode === "signup" ? "" : "sm:col-span-2"}>
                <div className={label}>Password</div>
                <input
                  type="password"
                  required
                  minLength={6}
                  className={field}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {mode === "signup" && (
                <>
                  <div>
                    <div className={label}>Full name</div>
                    <input
                      required
                      className={field}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className={label}>{role === "farmer" ? "Farm / FPO name" : "Company"}</div>
                    <input className={field} value={org} onChange={(e) => setOrg(e.target.value)} />
                  </div>
                  <div>
                    <div className={label}>City</div>
                    <input className={field} value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div>
                    <div className={label}>Phone</div>
                    <input
                      className={field}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </>
              )}

              {error && (
                <p className="sm:col-span-2 rounded-2xl bg-tomato/12 p-3 text-sm text-tomato ring-1 ring-tomato/25">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="sm:col-span-2 rounded-full bg-leaf px-4 py-3 text-sm font-semibold text-surface transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-105 disabled:opacity-60"
              >
                {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
              </button>
            </form>
          </div>
        </div>

        <div className="rise col-span-12 lg:col-span-5" style={{ animationDelay: "60ms" }}>
          <div className="h-full rounded-[1.75rem] bg-gradient-to-br from-sun/20 to-surface/80 p-6 ring-1 ring-line/70 backdrop-blur-xl">
            <h2 className="font-display text-lg font-semibold tracking-tight">What you get</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="rounded-2xl bg-surface/60 p-3 ring-1 ring-line/50">
                <span className="font-semibold text-ink">Farmers:</span> publish a lot with a fair
                price band and see every order that comes in.
              </li>
              <li className="rounded-2xl bg-surface/60 p-3 ring-1 ring-line/50">
                <span className="font-semibold text-ink">Buyers:</span> browse live lots from real
                farms and place an order in one tap.
              </li>
              <li className="rounded-2xl bg-surface/60 p-3 ring-1 ring-line/50">
                Prices stay transparent — farmer cut, logistics and final price are always visible.
              </li>
            </ul>
            <Link
              to="/"
              className="mt-5 inline-block rounded-full bg-surface/70 px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-line/70"
            >
              Browse the marketplace first
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
