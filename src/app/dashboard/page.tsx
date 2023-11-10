"use client";

import { useEffect, useState } from "react";
import Checkbox from "../components/Checkbox";
import { trpc } from "../trpc/client";
import { UserPreferencesInput } from "../types/db/UserPreferencesInput";

export default function Dashboard() {
  const updateUserPreferences = trpc.updateUserPreferences.useMutation();
  const userPreferences = trpc.getUserPreferences.useQuery();

  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userPreferences.data) {
      const preferences: UserPreferencesInput = userPreferences.data;
      const initialCheckedValues = Object.keys(preferences).filter(
        (key) => preferences[key as keyof UserPreferencesInput]
      );
      setCheckedValues(initialCheckedValues);
      setLoading(false);
    }
  }, [userPreferences.data]);

  const handleCheckboxChange = (value: string) => {
    setCheckedValues((prevValues) => {
      if (prevValues.includes(value)) {
        return prevValues.filter((v) => v !== value);
      } else {
        return [...prevValues, value];
      }
    });
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

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="flex flex-col items-center justify-between px-4 md:px-6">
      <h1 className="text-4xl font-bold mb-2">Welcome</h1>
      <p className="text-lg mb-8">Please select your reminder options.</p>
      <div className="grid md:grid-cols-2 gap-8 xl:gap-10">
        <div className="space-y-8 xl:space-y-10">
          <label className="text-xl font-bold">Schedule:</label>

          <Checkbox
            label="1 Day Before"
            onChange={(checked) => handleCheckboxChange("send_1_day_before", checked,)}
            defaultValue={userPreferences.data?.send_1_day_before}
          />
          <Checkbox
            label="3 Hours Before"
            onChange={(checked) => handleCheckboxChange("send_3_hours_before", checked)}
            defaultValue={userPreferences.data?.send_3_hours_before}
          />
          <Checkbox
            label="30 Minutes Before"
            onChange={(checked) => handleCheckboxChange("send_30_minutes_before", checked)}
            defaultValue={userPreferences.data?.send_30_minutes_before}
          />
        </div>
        <div className="space-y-8 xl:space-y-10">
          <label className="text-xl font-bold">Type:</label>

          <Checkbox
            label="Fixture Reminder"
            onChange={(checked) => handleCheckboxChange("send_fixture_reminder", checked)}
            defaultValue={userPreferences.data?.send_fixture_reminder}
          />
          <Checkbox
            label="Trending Transfers In"
            onChange={(checked) => handleCheckboxChange("send_transfer_in", checked)}
            defaultValue={userPreferences.data?.send_transfer_in}
          />
          <Checkbox
            label="Trending Transfers Out"
            onChange={(checked) => handleCheckboxChange("send_transfer_out", checked)}
            defaultValue={userPreferences.data?.send_transfer_out}
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
