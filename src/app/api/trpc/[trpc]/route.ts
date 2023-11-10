import { appRouter } from "@/server";
import { Context } from "@/server/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => Context({ req }),
  });

export { handler as GET, handler as POST };
