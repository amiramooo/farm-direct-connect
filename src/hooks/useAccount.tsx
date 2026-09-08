import type { Session, User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export type Role = "farmer" | "buyer";

export type Profile = {
  id: string;
  full_name: string;
  org: string;
  city: string;
  phone: string;
};

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user: (session?.user ?? null) as User | null, loading };
}

export function useAccount() {
  const { session, user, loading } = useSession();

  const query = useQuery({
    queryKey: ["account", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const [profileRes, roleRes] = await Promise.all([
        supabase.from("profiles").select("id, full_name, org, city, phone").eq("id", user!.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", user!.id).maybeSingle(),
      ]);
      return {
        profile: (profileRes.data ?? null) as Profile | null,
        role: ((roleRes.data?.role as Role | undefined) ?? "farmer") as Role,
      };
    },
  });

  return {
    session,
    user,
    loading: loading || (Boolean(user) && query.isLoading),
    profile: query.data?.profile ?? null,
    role: query.data?.role ?? null,
  };
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
}
