"use client";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "../trpc/client";
import { useState } from "react";


export default function RegisterPhone() {
  
const registerPhoneNumber = trpc.registerPhoneNumber.useMutation();
const validatePhoneNumber = trpc.validatePhoneNumber.useMutation();
const [phoneNumber, setPhoneNumber] = useState('');

const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setPhoneNumber(event.target.value);
};

const [inputCode, setInputCode] = useState('');

const handleInputCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setInputCode(event.target.value);
};

const handleRegisterPhoneNumber = () => {
  registerPhoneNumber.mutateAsync(
    {
      phone_number: phoneNumber
    }
  );
};

const handleVerifyCode = () => {
  validatePhoneNumber.mutateAsync(
    {
      input_code: inputCode
    }
  );
};
  
  return (
    <div>
      <Card className="mx-4 md:mx-auto max-w-sm bg-white bg-opacity-90 shadow-lg rounded-lg mt-10">
        <CardHeader className="space-y-1 bg-slate-100 p-4 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-slate-900">
            Phone Verification
          </CardTitle>
          <CardDescription className="text-slate-800">
            Please enter your phone number to receive a verification code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="space-y-2">
            <Label className="text-slate-700" htmlFor="phone">
              Phone Number
            </Label>
            <Input
              className="border-slate-300 focus:border-slate-600"
              id="phone"
              placeholder="+1 234 567 8900"
              required
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
          </div>
          <Button
            className="w-full bg-slate-700 text-white hover:bg-slate-600"
            type="submit"
            onClick={handleRegisterPhoneNumber}
          >
            Send Verification Code
          </Button>
        </CardContent>
      </Card>
      <Card className="mx-4 md:mx-auto max-w-sm bg-white bg-opacity-90 shadow-lg rounded-lg mt-10">
        <CardHeader className="space-y-1 bg-slate-100 p-4 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-slate-900">
            Enter Verification Code
          </CardTitle>
          <CardDescription className="text-slate-800">
            A verification code has been sent to your phone number. Please enter
            it below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="space-y-2">
            <Label className="text-slate-700" htmlFor="code">
              Verification Code
            </Label>
            <Input
              className="border-slate-300 focus:border-slate-600"
              id="code"
              placeholder="Enter code"
              required
              type="text"
              value={inputCode}
              onChange={handleInputCodeChange}
            />
          </div>
          <Button
            className="w-full bg-slate-700 text-white hover:bg-slate-600"
            type="submit"
            onClick={handleVerifyCode}
          >
            Verify
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
