import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

const UpdateVendor = ({ vendorId }) => {
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    const fetchVendor = async () => {
      const vendorRef = doc(db, "Vender", vendorId);
      const vendorSnap = await getDoc(vendorRef);

      if (vendorSnap.exists()) {
        setVendor({ id: vendorSnap.id, ...vendorSnap.data() });
      } else {
        alert("Vendor not found!");
      }
    };

    fetchVendor();
  }, [vendorId]);

  const handleTransactionChange = (e, type, index) => {
    const { value } = e.target;
    setVendor((prev) => {
      const updatedTransactions = [...prev[type]];
      updatedTransactions[index].amount = Number(value);
      return { ...prev, [type]: updatedTransactions };
    });
  };

  const saveChanges = async () => {
    if (!vendor) return;
    const vendorRef = doc(db, "Vender", vendor.id);

    const totalPayments = vendor.PaymentTransactions.reduce(
      (sum, trans) => sum + trans.amount,
      0
    );
    const totalPurchases = vendor.PurchaseTransactions.reduce(
      (sum, trans) => sum + trans.amount,
      0
    );
    const newTotalDue = totalPurchases - totalPayments;

    try {
      await updateDoc(vendorRef, {
        PaymentTransactions: vendor.PaymentTransactions,
        PurchaseTransactions: vendor.PurchaseTransactions,
        TotalDue: newTotalDue,
      });
      alert("Vendor updated successfully!");
    } catch (error) {
      console.error("Error updating vendor:", error);
      alert("Failed to update vendor.");
    }
  };

  if (!vendor) return <p>Loading vendor data...</p>;

  return (
    <div className="bg-[#1414148c] w-full h-full min-h-screen absolute top-0 left-0 z-60 flex justify-center items-center">
      <h2 className="w-full max-w-lg backdrop-blur-3xl text-[#e3e3e3] shadow-md p-6 rounded-xl">
         Vendor
      </h2>
      <p className="text-lg"> {vendor.Name}</p>

      {/* Payment Transactions */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Payment Transactions</h3>
        {vendor.PaymentTransactions.map((payment, index) => (
          <input
            key={index}
            type="number"
            value={payment.amount}
            onChange={(e) =>
              handleTransactionChange(e, "PaymentTransactions", index)
            }
            className="p-2 rounded bg-gray-700 mt-2 w-full"
          />
        ))}
      </div>

      {/* Purchase Transactions */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Purchase Transactions</h3>
        {vendor.PurchaseTransactions.map((purchase, index) => (
          <input
            key={index}
            type="number"
            value={purchase.amount}
            onChange={(e) =>
              handleTransactionChange(e, "PurchaseTransactions", index)
            }
            className="p-2 rounded bg-gray-700 mt-2 w-full"
          />
        ))}
      </div>

      {/* Total Due */}
      <div className="text-lg font-bold text-red-400 mt-4">
        Total Due: ₹{vendor.TotalDue.toLocaleString()}
      </div>

      <button
        onClick={saveChanges}
        className="bg-green-500 hover:bg-green-600 p-2 rounded text-white font-semibold mt-4"
      >
        Save Changes
      </button>
    </div>
  );
};

export default UpdateVendor;
