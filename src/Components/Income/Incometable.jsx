import React, { useState, useEffect, useRef } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../../utils/firebase";
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

function Incometable() {
  const [Model, SetModel] = useState("");
  const [Amount, SetAmount] = useState("");
  const [PaymentMode, SetPaymentMode] = useState("");
  const [Notes, SetNotes] = useState("");
  const [Company, SetCompany] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [type] = useState("Income");
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
    e.preventDefault();
    try {
      await addDoc(collection(db, "Income"), {
        userid: auth?.currentUser?.uid,
        Model,
        Amount,
        PaymentMode,
        Company,
        Notes,
        Date: date,
        Time: time,
        Type: type,
      });

      alert("Successfully added");
      SetModel("");
      SetAmount("");
      SetPaymentMode("");
      SetNotes("");
      SetCompany("");
      formRef.current.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col p-6 shadow-md rounded-lg gap-8 backdrop-blur border border-zinc-300 shadow-box-income w-full max-w-xl mx-auto ">
      <span>
        <h2 className="text-green-500 text-3xl md:text-4xl font-bold">{type}</h2>
        <h1 className="text-md text-white/30 font-light">
          Add your details for income
        </h1>
      </span>

      <form ref={formRef} onSubmit={handleInput} className="flex flex-col gap-3">
        <label className="text-lg text-white"> Model</label>
        <input
          type="text"
          required
          value={Model}
          onChange={(e) => SetModel(e.target.value)}
          placeholder="Enter your Model"
          className="w-full py-3 px-3 bg-transparent text-white rounded-xl border border-zinc-300/20 hover:border-zinc-300 focus:ring-2 focus:ring-zinc-950"
        />

        <label className="text-lg text-white"> Company</label>
        <input
          type="text"
          required
          list="phone-companies"
          value={Company}
          onChange={(e) => SetCompany(e.target.value)}
          placeholder="Enter Phone Company"
          className="w-full py-3 px-3 bg-transparent text-white rounded-xl border border-zinc-300/20 hover:border-zinc-300 focus:ring-2 focus:ring-zinc-950"
        />
        <datalist id="phone-companies">
          <option value="Apple" />
          <option value="Samsung" />
          <option value="Realme" />
          <option value="Vivo" />
          <option value="OnePlus" />
          <option value="Mi" />
          <option value="Nokia" />
          <option value="Oppo" />
          <option value="Other" />
        </datalist>

        <label className="text-lg text-white"> Payment Mode</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {paymentModes.map((mode) => (
            <button
              type="button"
              key={mode.name}
              onClick={() => SetPaymentMode(mode.name)}
              className={`flex items-center justify-center flex-col gap-2 px-3 py-3 rounded-lg border text-sm md:text-base ${
                PaymentMode === mode.name
                  ? "bg-green-600 text-white"
                  : "bg-transparent border-zinc-300/20 text-white hover:border-zinc-300"
              }`}
            >
              <span className="text-2xl md:text-3xl">{mode.icon}</span> {mode.name}
            </button>
          ))}
        </div>

        <label className="text-lg text-white"> Amount</label>
        <input
          type="number"
          required
          value={Amount}
          onChange={(e) => SetAmount(e.target.value)}
          placeholder="Amount"
          className="w-full py-3 px-3 bg-transparent text-white rounded-xl border border-zinc-300/20 hover:border-zinc-300 focus:ring-2 focus:ring-zinc-950"
        />

        <label className="text-lg text-white"> Notes</label>
        <textarea
          rows="3"
          value={Notes}
          onChange={(e) => SetNotes(e.target.value)}
          placeholder="Note"
          className="w-full py-3 px-3 bg-transparent text-white rounded-xl border border-zinc-300/20 hover:border-zinc-300 focus:ring-2 focus:ring-zinc-950"
        ></textarea>

        <button
          type="submit"
          className="w-full py-4 px-3 bg-zinc-950 text-white rounded-xl hover:bg-zinc-400 hover:text-black border border-zinc-400 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Incometable;
