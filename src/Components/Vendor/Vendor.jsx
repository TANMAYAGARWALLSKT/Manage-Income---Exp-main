import { Input, Button } from "@nextui-org/react";
import React, { useState, useRef } from "react";

function Vendor() {
  const [vendorName, setVendorName] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorPhone, setVendorPhone] = useState("");
  const formRef = useRef(null);
  const Handlesubmit = (e) => {
    e.preventDefault();
    console.log(vendorName, vendorEmail, vendorPhone);
    setVendorName("");
    setVendorEmail("");
    setVendorPhone("");
    formRef.current.reset();
  };
  return (
    <div className="text-zinc-300 bg-[#111111]  w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Vendor</h1>
      <div className=" bg-slate-600/50 rounded-md p-4  py-6 z-20  flex flex-col gap-4  w-1/2">
        <form ref={formRef} onSubmit={Handlesubmit}>
          <Input
            onChange={(e) => setVendorName(e.target.value)}
            placeholder="Vendor Name"
            className="w-full  "
          />
          <Input
            onChange={(e) => setVendorEmail(e.target.value)}
            placeholder="Vendor Email"
            className="w-full  "
          />
          <Input
            onChange={(e) => setVendorPhone(e.target.value)}
            placeholder="Vendor Phone"
            className="w-full  "
          />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
}

export default Vendor;





// Name ---string  
// Date ---string 
// Type (Purchase, Paid )---string
// Amount---number
// Payment Mode---string
// Notes---string


