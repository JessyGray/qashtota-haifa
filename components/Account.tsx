"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { Session } from "@supabase/supabase-js";
import type { Dict } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

type Row = { id: number; points: number; reason: string; created_at: string };

export default function Account({ t }: { t: Dict["account"] }) {
  const sb = supabase();
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [qr, setQr] = useState("");

  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [sb]);

  useEffect(() => {
    if (!sb || !session) return;
    sb.from("loyalty_ledger").select("id, points, reason, created_at").order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => setRows((data as Row[]) || []));
    QRCode.toDataURL(session.user.id, { margin: 1, width: 240, color: { dark: "#1F65AB" } }).then(setQr);
  }, [sb, session]);

  if (!sb) return <p className="lead">{t.notReady}</p>;

  if (!session) {
    return (
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.href } });
          if (!error) setSent(true);
        }}
      >
        <label>
          {t.email}
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" />
        </label>
        <button className="btn" type="submit">{t.send}</button>
        {sent && <p>{t.sent}</p>}
      </form>
    );
  }

  const total = rows.reduce((s, r) => s + r.points, 0);
  return (
    <div className="account">
      <p className="big">{total} {t.points}</p>
      {qr && <figure><img src={qr} alt="" width={240} height={240} /><figcaption>{t.qr}</figcaption></figure>}
      <h2>{t.history}</h2>
      <table className="hours">
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}><td>{new Date(r.created_at).toLocaleDateString()}</td><td>{r.reason}</td><td dir="ltr">{r.points > 0 ? "+" : ""}{r.points}</td></tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-ghost" onClick={() => sb.auth.signOut()}>{t.logout}</button>
    </div>
  );
}
