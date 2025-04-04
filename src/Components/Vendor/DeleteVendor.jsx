
import React from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../utils/firebase";

function DeleteVendor({ vendor, onClose, onVendorDeleted }) {
  const handleConfirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "Vender", vendor.id));
      onVendorDeleted(); // Refresh vendors
      onClose(); // Close modal
    } catch (error) {
      console.error("Error deleting vendor:", error);
      alert("Failed to delete vendor. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Delete Vendor</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete{" "}
          <strong>{vendor?.name || "this vendor"}</strong>? This action cannot
          be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteVendor;
