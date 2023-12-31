import { log } from "next-axiom";
import { TwilioApiInterface } from "./TwilioApiInterface";
import { Twilio } from "twilio";

class TwilioApi implements TwilioApiInterface {
  public async sendVerificationCode(phoneNumber: string): Promise<boolean> {
    try {
      const requestBody = new URLSearchParams();
      requestBody.append("To", phoneNumber);
      requestBody.append("Channel", "sms");

      const twilioApiUrl = `https://verify.twilio.com/v2/Services/${process.env.TWILIO_VERIFICATION_SERVICE_ID}/Verifications`;

      const response = await fetch(twilioApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`,
          ).toString("base64")}`,
        },
        body: requestBody,
      });

      if (!response.ok) {
        throw new Error(
          `Twilio API request failed with status ${response.status}`,
        );
      }

      const responseData = await response.json();

      log.info(responseData);

      return true;
    } catch (error) {
      // Handle errors
      if (error instanceof Error) {
        log.error(error.message);
      }
      return false;
    }
  }

  public async verifyCode(
    phoneNumber: string,
    inputCode: string,
  ): Promise<boolean> {
    try {
      const requestBody = new URLSearchParams();
      requestBody.append("To", phoneNumber);
      requestBody.append("Code", inputCode);

      const twilioApiUrl = `https://verify.twilio.com/v2/Services/${process.env.TWILIO_VERIFICATION_SERVICE_ID}/VerificationCheck`;

      const response = await fetch(twilioApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`,
          ).toString("base64")}`,
        },
        body: requestBody,
      });

      if (!response.ok) {
        throw new Error(
          `Twilio API request failed with status ${response.status}`,
        );
      }

      const responseData = await response.json();

      log.info(responseData);

      if (responseData.status !== "approved") {
        throw new Error(`Invalid Code Input.`);
      }

      return true;
    } catch (error) {
      // Handle errors
      if (error instanceof Error) {
        log.error(error.message);
      }
      return false;
    }
  }

  public async sendSmsUpdate(
    phoneNumber: string,
    message: string,
  ): Promise<boolean> {
    try {
      const client = new Twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );

      client.messages
        .create({
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber,
          body: message,
        })
        .then((message) => console.log(message.sid));

      return true;
    } catch (error) {
      if (error instanceof Error) {
        log.error(error.message);
      }
      throw new Error("Failed to fetch data from the FPL API.");
    }

    return false;
  }
}

export default TwilioApi;
