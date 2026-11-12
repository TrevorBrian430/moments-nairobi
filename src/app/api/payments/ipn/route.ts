export function POST() {
  return Response.json({ error: "Online payments are disabled." }, { status: 503 });
}
