// InputField.js
import { Input } from "@nextui-org/react";
import React from "react";

const InputField = ({ label, value, onChange, type }) => {
  return (
    <Input
      onChange={onChange}
      value={value}
      className="w-[20vw] font-bold"
      type={type}
      label={label}
      placeholder=" End date"
    />
  );
};

export default InputField;
