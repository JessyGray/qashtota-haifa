import { put } from "@vercel/blob";

// One-off upload door for generated photos and frames. Closed unless UPLOAD_KEY is set.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, x-upload-key, x-path",
};

export async function OPTIONS() {
  return new Response(null, { headers: cors });
}

export async function POST(req: Request) {
  const key = process.env.UPLOAD_KEY;
  if (!key || req.headers.get("x-upload-key") !== key) return new Response("forbidden", { status: 403, headers: cors });
  const path = (req.headers.get("x-path") || "").replace(/^\/+/, "");
  if (!/^[a-z0-9/_.-]+\.(webp|jpg|png|mp4)$/.test(path)) return new Response("bad path", { status: 400, headers: cors });
  const blob = await put(path, req.body!, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: req.headers.get("content-type") || undefined,
  });
  return Response.json({ url: blob.url }, { headers: cors });
}
