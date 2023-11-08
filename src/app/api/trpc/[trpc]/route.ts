import { appRouter } from "@/server";
import { PrismaClient } from "@prisma/client";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { auth } from "@clerk/nextjs/server";


const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      const db = new PrismaClient();
      const { userId } : { userId: string | null } = auth();

      return { db, userId };
    },
  });

export { handler as GET, handler as POST };
