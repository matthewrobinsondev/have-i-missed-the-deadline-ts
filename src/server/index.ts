import { UserPreferencesRouter } from "./routers/userPreferences";
import { router, privateProcedure, publicProcedure } from "./trpc";

export const appRouter = router({
  updateUserPreferences: UserPreferencesRouter.updateUserPreferences,
});

export type AppRouter = typeof appRouter;
