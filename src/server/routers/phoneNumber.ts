import { z } from "zod";
import { privateProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { log } from "next-axiom";

// TODO: Add Unit Testing

export const PhoneNumberRouter = router({
  registerPhoneNumber: privateProcedure
    .input(
      z.object({
        phone_number: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      if (!isValidUKPhoneNumber(input.phone_number)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Phone number is not a valid UK Number.",
        });
      }

      log.debug(`Sending verification code to ${userId}`);

      ctx.twilioApi.sendVerificationCode(input.phone_number);

      await ctx.db.userContact.upsert({
        where: { user_id: userId },
        create: {
          user_id: userId,
          phone_number: input.phone_number, // TODO: encrypt
          is_verified: false,
        },
        update: {
          phone_number: input.phone_number, // TODO: encrypt
          is_verified: false,
        },
      });

      return true;
    }),
  validatePhoneNumber: privateProcedure
    .input(
      z.object({
        input_code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const userContact = await ctx.db.userContact.findUnique({
        where: { user_id: userId },
      });

      if (!userContact) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const response = await ctx.twilioApi.verifyCode(
        userContact.phone_number,
        input.input_code,
      );

      if (!response) {
        log.debug("Invalid code entered.");
        return false;
      }

      log.debug("successfully validated.");

      await ctx.db.userContact.update({
        where: { user_id: userId },
        data: {
          is_verified: true,
        },
      });

      return true;
    }),
  deletePhoneNumber: privateProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    log.debug(`Deleting ${userId} contact information.`);

    await ctx.db.userContact.delete({
      where: { user_id: userId },
    });
  }),
  getPhoneNumber: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const userContact = await ctx.db.userContact.findUnique({
      where: { user_id: userId },
    });

    if (!userContact) {
      return {
        phoneNumber: null,
      };
    }

    const hiddenNumber = userContact.phone_number.substring(
      userContact.phone_number.length - 4,
    );

    return {
      phoneNumber: hiddenNumber,
    };
  }),
});

function isValidUKPhoneNumber(phoneNumber: string): boolean {
  const ukPhoneNumberRegex =
    /^(?:(?:\+44)|(?:0))(?:(?:(?:20[78])|(?:77[1-9])|(?:78[0-9])|(?:79[0-9])|(?:74[4-9]))[0-9]{8}|(?:7505[0-9]{6})|(?:7624[0-9]{6})|(?:762[0-9]{7})|(?:76[3-5][0-9]{6})|(?:76[6-9][0-9]{6})|(?:70[03][0-9]{6})|(?:75[0-9]{7})|(?:77[0-9]{7})|(?:78[0-9]{7})|(?:79[0-9]{7})|(?:74[4-9]9[0-9]{5})|(?:74[4-9][0-9]{6}))$/;

  // Temporary variable to suppress TypeScript error
  const testResult = ukPhoneNumberRegex.test(phoneNumber);

  return testResult;
}
