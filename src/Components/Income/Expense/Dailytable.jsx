import React, { useState, useEffect, useRef } from "react";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../../utils/firebase";
import { Input, Button, Divider } from "@nextui-org/react";

function Dailytable() {
  const [Model, SetModel] = useState("");
  const [Amount, SetAmount] = useState("");
  const [PaymentMode, SetPaymentMode] = useState("");
  const [Notes, SetNotes] = useState("");
  const [Company, SetCompany] = useState("");
  const moviesCollectionRef = collection(db, "Income");
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [type, setType] = useState("Expense");
  const formRef = useRef(null); // Initialize the ref variable

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setDate(new Date().toLocaleDateString());
  }, []);

  const handleinput = async (e) => {
    try {
      e.preventDefault();

      await addDoc(moviesCollectionRef, {
        Amount: Amount,
        Company: Company,
        Notes: Notes,
        PaymentMode: PaymentMode,
        Model: Model,
        Date: date,
        Time: time,
        Type: type,
        userid: auth?.currentUser?.uid,
      });

      // Reset form fields after successful submission
      SetNotes("");
      SetAmount("");
      SetPaymentMode("");
      SetModel("");
      SetCompany("");

      // Clear the form using the ref
      formRef.current.reset();

      alert("Sale added successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex gap-5 shadow-box-expense  py-5 px-2  rounded-xl flex-col justify-center  bg-stone-800 z-50  ">
      {" "}
      <h1 className=" text-red-600 text-7xl uppercase   w-full  font-bold  flex justify-center items-center ">
        {type}
      </h1>
      <Divider className="bg-white/50" />
      <form
        ref={formRef} // Attach the ref to the form element
        id="Income"
        onSubmit={handleinput}
        className=""
      >
        <span className="   rounded-xl  flex justify-center gap-5 flex-col px-10 text-black  py-12 w-[40vw]">
          <Input
            label="Note"
            className=""
            type="text"
            size="lg"
            placeholder="Note"
            value={Notes} // Set the value prop for controlled input
            onChange={(e) => SetNotes(e.target.value)}
          />

          <Input
            label="Amount"
            className=""
            type="number"
            id="Amount"
            name="Amount"
            size="lg"
            placeholder="Amount"
            value={Amount} // Set the value prop for controlled input
            onChange={(e) => SetAmount(e.target.value)}
          />

          <Input
            label="Payment Mode"
            className=""
            type="text"
            id="payment-mode"
            name="payment_mode"
            size="lg"
            value={PaymentMode}
            placeholder="Enter Payment Mode"
            list="payment-options"
            onChange={(e) => SetPaymentMode(e.target.value)}
          />
          <datalist id="payment-options">
            <option value="UPI">UPI</option>
            <option value="Credit Card">C.C</option>
            <option value="Cash">Cash</option>
            <option value="Due">DUE</option>
            <option value="Paid">Paid</option>
            <option value="Bajaj">Bajaj</option>
            <option value="Other">Others</option>
          </datalist>

          <Button type="submit" size="lg" className=" bg-black text-white ">
            Submit
          </Button>
        </span>
      </form>
    </div>
  );
}

export default Dailytable;
