import React, { useState, useEffect, useRef } from "react";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../../utils/firebase";
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaMobileAlt,
  FaCashRegister,
} from "react-icons/fa";

const paymentModes = [
  { name: "UPI", icon: <FaMobileAlt /> },
  { name: "Credit Card", icon: <FaCreditCard /> },
  { name: "Cash", icon: <FaMoneyBillWave /> },
  { name: "Due", icon: <FaCashRegister /> },
  { name: "Paid", icon: <FaMoneyBillWave /> },
  { name: "Bajaj", icon: <FaCreditCard /> },
  { name: "Other", icon: <FaCashRegister /> },
];

function Expense() {
  const [Model, SetModel] = useState("");
  const [Amount, SetAmount] = useState("");
  const [PaymentMode, SetPaymentMode] = useState("");
  const [Notes, SetNotes] = useState("");
  const moviesCollectionRef = collection(db, "Income");
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [type] = useState("Expense");
  const formRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setDate(new Date().toLocaleDateString());
  }, []);

  const handleInput = async (e) => {
    try {
      e.preventDefault();

      await addDoc(moviesCollectionRef, {
        Amount,
        Notes,
        PaymentMode,
        Model,
        Date: date,
        Time: time,
        Type: type,
        userid: auth?.currentUser?.uid,
      });

      SetNotes("");
      SetAmount("");
      SetPaymentMode("");
      SetModel("");
      formRef.current.reset();

      alert("Expense added successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col p-6 shadow-md rounded-lg gap-8 backdrop-blur border border-zinc-300 shadow-box-expense w-[40vw] mx-auto">
      <span>
        <h2 className="text-red-500 text-5xl font-bold">{type}</h2>
        <h1 className="text-md text-white/30 font-light">Add your details for expense</h1>
      </span>

      <form ref={formRef} id="Expense" onSubmit={handleInput} className="flex flex-col gap-3">
        {/* Model Input */}
        <label className="text-lg text-white"> Model</label>
        <input
          type="text"
          required
          value={Model}
          onChange={(e) => SetModel(e.target.value)}
          placeholder="Enter Model"
          className="w-full py-5 px-3 bg-transparent text-white rounded-xl border-zinc-300/20 border-1 hover:border-zinc-300 active:border-zinc-300 focus:ring-2 focus:ring-zinc-950"
        />

        {/* Payment Mode Tiles */}
        <label className="text-lg text-white"> Payment Mode</label>
        <div className="flex flex-1 gap-4">
          {paymentModes.map((mode) => (
            <button
              type="button"
              key={mode.name}
              onClick={() => SetPaymentMode(mode.name)}
              className={`flex items-center justify-center flex-col flex-1 gap-2 px-2 py-4 rounded-lg border ${
                PaymentMode === mode.name
                  ? "bg-red-600 text-white"
                  : "bg-transparent border-zinc-300/20 text-white hover:border-zinc-300"
              }`}
            >
              <span className="text-3xl">{mode.icon}</span> {mode.name}
            </button>
          ))}
        </div>

        {/* Amount */}
        <label className="text-lg text-white"> Amount</label>
        <input
          type="number"
          required
          value={Amount}
          onChange={(e) => SetAmount(e.target.value)}
          placeholder="Amount"
          className="w-full py-5 px-3 bg-transparent text-white rounded-xl border-zinc-300/20 border-1 hover:border-zinc-300 active:border-zinc-300 focus:ring-2 focus:ring-zinc-950"
        />

        {/* Notes */}
        <label className="text-lg text-white"> Notes</label>
        <textarea
          rows="3"
          value={Notes}
          onChange={(e) => SetNotes(e.target.value)}
          placeholder="Note"
          className="w-full py-5 px-3 bg-transparent text-white rounded-xl border-zinc-300/20 border-1 hover:border-zinc-300 active:border-zinc-300 focus:ring-2 focus:ring-zinc-950"
        ></textarea>

        {/* Submit Button */}
        <button type="submit" className="w-full py-5 px-3 bg-red-600 text-white rounded-xl hover:bg-red-400 hover:text-black border border-zinc-400 transition">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Expense;