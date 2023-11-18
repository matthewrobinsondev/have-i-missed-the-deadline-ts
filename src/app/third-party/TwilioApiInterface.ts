interface TwilioApiInterface {
    sendVerificationCode(phoneNumber: string): Promise<any>;
    verifyCode(phonNumber: string, inputCode: string): Promise<any>;
    sendSmsUpdate(): Promise<any>;
}