"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

// Staff screen: add points for a purchase by the customer's code (the value in their QR).
export default function Admin({ notReady }: { notReady: string }) {
  const sb = supabase();
  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  if (!sb) return <p className="lead">{notReady}</p>;
  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault();
        const { error } = await sb.rpc("add_purchase", { p_customer: customer.trim(), p_amount: Number(amount) });
        setMsg(error ? error.message : "OK");
        if (!error) { setCustomer(""); setAmount(""); }
      }}
    >
      <label>Customer code<input required value={customer} onChange={(e) => setCustomer(e.target.value)} dir="ltr" /></label>
      <label>₪<input required type="number" min="1" step="0.5" value={amount} onChange={(e) => setAmount(e.target.value)} dir="ltr" /></label>
      <button className="btn" type="submit">+</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
