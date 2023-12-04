export async function GET() {
  const res = await fetch(
    "https://fantasy.premierleague.com/api/bootstrap-static/",
    {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    },
  );

  const data = await res.json();

  return Response.json(data);
}
