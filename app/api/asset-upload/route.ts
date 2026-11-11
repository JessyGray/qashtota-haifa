import { put } from "@vercel/blob";

// One-off upload door for generated photos and frames. Closed unless UPLOAD_KEY is set.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, x-upload-key, x-path, x-source-url",
};

export async function OPTIONS() {
  return new Response(null, { headers: cors });
}

export async function POST(req: Request) {
  const key = process.env.UPLOAD_KEY;
  if (!key || req.headers.get("x-upload-key") !== key) return new Response("forbidden", { status: 403, headers: cors });
  const path = (req.headers.get("x-path") || "").replace(/^\/+/, "");
  if (!/^[a-z0-9/_.-]+\.(webp|jpg|jpeg|png|mp4)$/.test(path)) return new Response("bad path", { status: 400, headers: cors });
  // Optional: copy a source photo from the branch's own digital menu instead of sending bytes.
  const source = req.headers.get("x-source-url");
  let body: ReadableStream | Blob | null = req.body;
  let type = req.headers.get("content-type") || undefined;
  if (source) {
    if (!source.startsWith("https://mini-rest.com/wp-content/uploads/")) return new Response("bad source", { status: 400, headers: cors });
    const r = await fetch(source);
    if (!r.ok) return new Response("source " + r.status, { status: 502, headers: cors });
    body = await r.blob();
    type = r.headers.get("content-type") || undefined;
  }
  const blob = await put(path, body!, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: type,
  });
  return Response.json({ url: blob.url }, { headers: cors });
}
