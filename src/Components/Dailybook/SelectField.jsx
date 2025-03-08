import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
const SelectField = ({ label, value, onChange, items }) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      items={items}
      label={label}
      placeholder={`Select a ${label}`}
      className="max-w-md font-bold"
    >
      {items.map((item) => (
        <SelectItem key={item.value}>{item.label}</SelectItem>
      ))}
    </Select>
  );
};

export default SelectField;
