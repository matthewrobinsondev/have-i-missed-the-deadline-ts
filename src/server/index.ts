import { PhoneNumberRouter } from "./routers/phoneNumber";
import { TwilioUpdateRouter } from "./routers/twilioUpdates";
import { UserPreferencesRouter } from "./routers/userPreferences";
import { router } from "./trpc";

export const appRouter = router({
  getUserPreferences: UserPreferencesRouter.getUserPreferences,
  updateUserPreferences: UserPreferencesRouter.updateUserPreferences,
  updateOneDay: TwilioUpdateRouter.updateOneDay,
  getUserPhoneNumber: PhoneNumberRouter.getPhoneNumber,
  registerPhoneNumber: PhoneNumberRouter.registerPhoneNumber,
  validatePhoneNumber: PhoneNumberRouter.validatePhoneNumber,
  deletePhoneNumber: PhoneNumberRouter.deletePhoneNumber,
});

export type AppRouter = typeof appRouter;
