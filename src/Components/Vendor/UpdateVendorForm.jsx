import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

function UpdateVendorForm({ selectedVendor, setSelectedVendor, setTotalDueAllVendors }) {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [purchaseItem, setPurchaseItem] = useState("");

  const handleAddTransaction = async () => {
    if (!selectedVendor) return alert("Please select a vendor first!");
    if (!paymentAmount && (!purchaseAmount || !purchaseItem)) {
      return alert("Please enter a valid transaction.");
    }

    const vendorRef = doc(db, "Vender", selectedVendor.id);

    const currentPayments = Array.isArray(selectedVendor.PaymentTransactions)
      ? selectedVendor.PaymentTransactions
      : [];

    const currentPurchases = Array.isArray(selectedVendor.PurchaseTransactions)
      ? selectedVendor.PurchaseTransactions
      : [];

    const updatedPayments = paymentAmount
      ? [
          ...currentPayments,
          { amount: Number(paymentAmount), date: new Date().toISOString() },
        ]
      : currentPayments;

    const updatedPurchases =
      purchaseAmount && purchaseItem
        ? [
            ...currentPurchases,
            {
              item: purchaseItem,
              amount: Number(purchaseAmount),
              date: new Date().toISOString(),
            },
          ]
        : currentPurchases;

    const totalPayments = updatedPayments.reduce(
      (sum, trans) => sum + trans.amount,
      0
    );
    const totalPurchases = updatedPurchases.reduce(
      (sum, trans) => sum + trans.amount,
      0
    );
    const newTotalDue = totalPurchases - totalPayments;
    const dueDifference = newTotalDue - selectedVendor.TotalDue;

    try {
      await updateDoc(vendorRef, {
        PaymentTransactions: updatedPayments,
        PurchaseTransactions: updatedPurchases,
        TotalDue: newTotalDue,
      });

      alert("Transaction added successfully!");

      setSelectedVendor((prev) => ({
        ...prev,
        PaymentTransactions: updatedPayments,
        PurchaseTransactions: updatedPurchases,
        TotalDue: newTotalDue,
      }));
      
      setTotalDueAllVendors(prevTotal => prevTotal + dueDifference);

      setPaymentAmount("");
      setPurchaseAmount("");
      setPurchaseItem("");
    } catch (error) {
      console.error("Error updating vendor:", error);
      alert("Failed to add transaction.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="bg-[#1414148c] w-full h-full min-h-screen absolute top-0 left-0 z-60 flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-full max-w-lg backdrop-blur-3xl text-[#e3e3e3] shadow-md p-6 rounded-xl"
          layout
          initial={{ scale: 0.8, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 20, opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <motion.div
            className="text-3xl font-semibold mb-4 border-b-1 border-[#141414] pb-2 flex justify-between"
            layout
          >
            <motion.h2 layout>Update Vendor: {selectedVendor.Name}</motion.h2>
            <motion.button
              onClick={() => setSelectedVendor(null)}
              className="font-light text-stone-500"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              ✖
            </motion.button>
          </motion.div>

          <motion.div
            className="flex flex-col text-[#141414] gap-3"
            layout
          >
            <motion.div
              layout
              className="text-lg font-bold text-red-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              Total Due: ₹{selectedVendor.TotalDue.toLocaleString()}
            </motion.div>

            <motion.div
              className="flex flex-col gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <motion.label className="font-medium text-[#e3e3e3]">
                Payment Amount
              </motion.label>
              <motion.input
                type="number"
                placeholder="Enter Payment Amount (₹)"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="p-2 border rounded-md"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              />

              <motion.label className="font-medium text-[#e3e3e3]">
                Item Name
              </motion.label>
              <motion.input
                type="text"
                placeholder="Item Name (for Purchase)"
                value={purchaseItem}
                onChange={(e) => setPurchaseItem(e.target.value)}
                className="p-2 border rounded-md"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              />

              <motion.label className="font-medium text-[#e3e3e3]">
                Purchase Amount
              </motion.label>
              <motion.input
                type="number"
                placeholder="Enter Purchase Amount (₹)"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                className="p-2 border rounded-md"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              />
            </motion.div>

            <motion.button
              onClick={handleAddTransaction}
              className="bg-blue-600 text-white p-2 rounded-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              Add Transaction
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default UpdateVendorForm; 