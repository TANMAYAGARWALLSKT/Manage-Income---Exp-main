import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../../utils/firebase";

function AddVendor({ onClose }) {
  const [vendor, setVendor] = useState({
    Name: "",
    ContactInfo: { Phone: "", Bank: "", Address: "" },
    PaymentTransactions: [{ id: "", amount: 0, date: "" }],
    PurchaseTransactions: [{ id: "", amount: 0, date: "" }],
    TotalDue: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("ContactInfo")) {
      const key = name.split("-")[1];
      setVendor((prev) => ({
        ...prev,
        ContactInfo: { ...prev.ContactInfo, [key]: value },
      }));
    } else {
      setVendor((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    const totalPayments = vendor.PaymentTransactions.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    const totalPurchases = vendor.PurchaseTransactions.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    setVendor((prev) => ({
      ...prev,
      TotalDue: totalPurchases - totalPayments,
    }));
  }, [vendor.PaymentTransactions, vendor.PurchaseTransactions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get the user ID from auth
      const userId = auth?.currentUser?.uid;

      // Include userId in the vendor object
      const vendorWithUserId = { ...vendor, userid: userId };

      await addDoc(collection(db, "Vender"), vendorWithUserId);
      alert("Vendor added successfully!");
      setVendor({
        Name: "",
        ContactInfo: { Phone: "", Bank: "", Address: "" },
        PaymentTransactions: [{ id: "", amount: 0, date: "" }],
        PurchaseTransactions: [{ id: "", amount: 0, date: "" }],
        TotalDue: 0,
      });
      onClose();
    } catch (error) {
      console.error("Error adding vendor:", error);
      console.log("ndor. Try again.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          >
            ✖
          </button>

          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
            Add Vendor
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="Name"
                value={vendor.Name}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="ContactInfo-Phone"
                value={vendor.ContactInfo.Phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank
              </label>
              <input
                type="text"
                name="ContactInfo-Bank"
                value={vendor.ContactInfo.Bank}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="ContactInfo-Address"
                value={vendor.ContactInfo.Address}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
              />
            </div>

            <div className="text-lg font-semibold text-red-600">
              Total Due: ₹{vendor.TotalDue.toLocaleString()}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 focus:ring focus:ring-indigo-300"
            >
              Add Vendor
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AddVendor;
