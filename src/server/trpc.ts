import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

const t = initTRPC.create({
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
  if (process.env.NODE_ENV === "test") {
    return opts.next({
      ctx: {
        db: opts.ctx.db,
        userId: opts.ctx.userId,
      },
    });
  }
  
  const { userId } = auth();

  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      db,
      userId: userId,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
