import { supabase } from "@/integrations/supabase/client";

export type Listing = {
  id: string;
  farmer_id: string;
  crop: string;
  quantity_kg: number;
  price_per_kg: number;
  city: string;
  harvest_date: string;
  status: string;
  created_at: string;
};

export type ListingWithFarmer = Listing & {
  profiles: { full_name: string; org: string; city: string } | null;
};

export type OrderRow = {
  id: string;
  listing_id: string;
  buyer_id: string;
  quantity_kg: number;
  price_per_kg: number;
  note: string;
  status: string;
  payment_status: string;
  paid_at: string | null;
  picked_up_at: string | null;
  created_at: string;
  listings: { crop: string; city: string; farmer_id: string } | null;
};

export type PayoutRow = {
  id: string;
  order_id: string;
  farmer_id: string;
  amount: number;
  status: string;
  released_at: string | null;
  settled_at: string | null;
  created_at: string;
  orders: {
    quantity_kg: number;
    price_per_kg: number;
    status: string;
    listings: { crop: string; city: string } | null;
  } | null;
};

const listingSelect =
  "id, farmer_id, crop, quantity_kg, price_per_kg, city, harvest_date, status, created_at, profiles:profiles!listings_farmer_id_fkey(full_name, org, city)";

export async function fetchOpenListings(): Promise<ListingWithFarmer[]> {
  const { data, error } = await supabase
    .from("listings")
    .select(listingSelect)
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as unknown as ListingWithFarmer[];
}

export async function fetchMyListings(farmerId: string): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("id, farmer_id, crop, quantity_kg, price_per_kg, city, harvest_date, status, created_at")
    .eq("farmer_id", farmerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Listing[];
}

export async function fetchMyOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, listing_id, buyer_id, quantity_kg, price_per_kg, note, status, payment_status, paid_at, picked_up_at, created_at, listings(crop, city, farmer_id)",
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as OrderRow[];
}

export async function fetchMyPayouts(farmerId: string): Promise<PayoutRow[]> {
  const { data, error } = await supabase
    .from("payouts")
    .select(
      "id, order_id, farmer_id, amount, status, released_at, settled_at, created_at, orders(quantity_kg, price_per_kg, status, listings(crop, city))",
    )
    .eq("farmer_id", farmerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as PayoutRow[];
}

