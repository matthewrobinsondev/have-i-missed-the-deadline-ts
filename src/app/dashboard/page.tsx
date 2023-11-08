"use client";

import { useState } from "react";
import Checkbox from "../components/Checkbox";
import { trpc } from "../trpc/client";

export default function Dashboard() {
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const updateUserPreferences = trpc.updateUserPreferences.useMutation();

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setCheckedValues([...checkedValues, value]);
    } else {
      setCheckedValues(checkedValues.filter((v) => v !== value));
    }
  };

  const handleSubmit = () => {
    updateUserPreferences.mutateAsync(
      {
        send_1_day_before: checkedValues.includes("send_1_day_before"),
        send_3_hours_before: checkedValues.includes("send_3_hours_before"),
        send_30_minutes_before: checkedValues.includes("send_30_minutes_before"),
        send_fixture_reminder: checkedValues.includes("send_fixture_reminder"),
        send_transfer_in: checkedValues.includes("send_transfer_in"),
        send_transfer_out: checkedValues.includes("send_transfer_out"),
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-between px-4 md:px-6">
      <h1 className="text-4xl font-bold mb-2">Welcome</h1>
      <p className="text-lg mb-8">Please select your reminder options.</p>
      <div className="grid md:grid-cols-2 gap-8 xl:gap-10">
        <div className="space-y-8 xl:space-y-10">
          <label className="text-xl font-bold">Schedule:</label>

          <Checkbox
            label="1 Day Before"
            onChange={(checked) => handleCheckboxChange("send_1_day_before", checked)}
          />
          <Checkbox
            label="3 Hours Before"
            onChange={(checked) => handleCheckboxChange("send_3_hours_before", checked)}
          />
          <Checkbox
            label="30 Minutes Before"
            onChange={(checked) => handleCheckboxChange("send_30_minutes_before", checked)}
          />
        </div>
        <div className="space-y-8 xl:space-y-10">
          <label className="text-xl font-bold">Type:</label>

          <Checkbox
            label="Fixture Reminder"
            onChange={(checked) => handleCheckboxChange("send_fixture_reminder", checked)}
          />
          <Checkbox
            label="Trending Transfers In"
            onChange={(checked) => handleCheckboxChange("send_transfer_in", checked)}
          />
          <Checkbox
            label="Trending Transfers Out"
            onChange={(checked) => handleCheckboxChange("send_transfer_out", checked)}
          />
        </div>
      </div>
      <div className="mt-6">
        <button
          className="bg-[#BD1E59] text-white px-4 py-2 rounded-md shadow-lg hover:bg-[#9D1B51]"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
