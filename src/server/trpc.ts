import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { type NextRequest } from "next/server";
import { FplService } from "@/app/fpl/FplService";
import FplApi from "@/app/third-party/FplApi";

export const Context = (opts: { req: NextRequest }) => {
  const { userId } = auth();
  const fplService = new FplService(new FplApi());

  return {
    headers: opts.req.headers,
    userId,    
    db,
    fplService
  };
};

const t = initTRPC.context<typeof Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  if (!opts.ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
