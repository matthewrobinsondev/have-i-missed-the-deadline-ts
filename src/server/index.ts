import { UserPreferencesRouter } from "./routers/userPreferences";
import { router, privateProcedure, publicProcedure } from "./trpc";

export const appRouter = router({
  getUserPreferences: UserPreferencesRouter.getUserPreferences,
  updateUserPreferences: UserPreferencesRouter.updateUserPreferences,
});

export type AppRouter = typeof appRouter;
