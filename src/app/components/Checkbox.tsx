"use client";
import React from "react";

interface CheckboxProps {
  label: string;
  onChange: (checked: boolean) => void;
  defaultValue: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, onChange, defaultValue }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <label className="flex items-center">
      <input
        className="form-checkbox h-5 w-5"
        type="checkbox"
        onChange={handleChange}
        defaultChecked={defaultValue}
      />
      <span className="ml-2 text-lg">{label}</span>
    </label>
  );
};

export default Checkbox;
