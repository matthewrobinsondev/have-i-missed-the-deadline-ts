export interface TwilioApiInterface {
  sendVerificationCode(phoneNumber: string): Promise<boolean>;
  verifyCode(phonNumber: string, inputCode: string): Promise<boolean>;
  sendSmsUpdate(phonNumber: string, message: string): Promise<boolean>;
}
