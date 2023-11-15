import { TwilioUpdateRouter } from "./routers/twilioUpdates";
import { UserPreferencesRouter } from "./routers/userPreferences";
import { router } from "./trpc";

export const appRouter = router({
  getUserPreferences: UserPreferencesRouter.getUserPreferences,
  updateUserPreferences: UserPreferencesRouter.updateUserPreferences,
  updateOneDay: TwilioUpdateRouter.updateOneDay,
});

export type AppRouter = typeof appRouter;
