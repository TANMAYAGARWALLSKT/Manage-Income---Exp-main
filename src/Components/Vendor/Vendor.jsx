import React, { useState, useEffect } from "react";
import { collection, query, getDocs, where } from "firebase/firestore";
import { db, auth } from "../../utils/firebase";
import VendorCard from "./VendorCard.jsx";
import AddVendor from "./AddVendor.jsx";
import UpdateVendorForm from "./UpdateVendorForm.jsx";
import VendorTransactionHistory from "./VendorTransactionHistory.jsx";
import DeleteVendor from "./DeleteVendor.jsx";
import { IoRefreshOutline } from "react-icons/io5";

function Vendor() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [totalDueAllVendors, setTotalDueAllVendors] = useState(0);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showvendorForm, setshowvendorForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleFetchVendors = async () => {
    const uid = auth?.currentUser?.uid;
    if (!uid) {
      console.warn("User is not authenticated. Skipping vendor fetch.");
      return;
    }

    setIsLoading(true);
    try {
      const vendorCollection = collection(db, "Vender");
      const querySnapshot = await getDocs(
        query(vendorCollection, where("userid", "==", uid))
      );

      const vendorsArray = [];
      let totalDue = 0;

      querySnapshot.forEach((doc) => {
        const vendorData = { id: doc.id, ...doc.data() };
        vendorsArray.push(vendorData);
        totalDue += vendorData.TotalDue || 0;
      });

      setVendors(vendorsArray);
      setTotalDueAllVendors(totalDue);
    } catch (error) {
      alert("Error fetching vendor data. Please try again.");
      console.error("Error fetching vendors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        handleFetchVendors();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="h-full my-auto mx-auto px-4 py-6 md:px-8 lg:px-12 bg-[#100C08] w-full">
      <div className="max-w-7xl py-4 mx-auto flex flex-col gap-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-white/30 border-b-2 py-4 px-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Vendors
            </h1>
            <p className="text-lg text-yellow-400 mt-2 font-medium">
              Total Due: ₹{totalDueAllVendors.toLocaleString()}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleFetchVendors}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2.5 rounded-lg text-white transition-all duration-200 shadow-md"
              disabled={isLoading}
            >
              <span
                className={`inline-block ${isLoading ? "animate-spin" : ""}`}
              >
                <IoRefreshOutline />
              </span>
              {isLoading ? "Loading..." : "Refresh"}
            </button>
            <button
              onClick={() => setShowAddVendor(true)}
              className="bg-green-500 hover:bg-green-600 px-6 py-2.5 rounded-lg text-white font-medium transition-all duration-200 shadow-lg hover:shadow-green-500/25"
            >
              + Add Vendor
            </button>
          </div>
        </div>

        {/* Vendors Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-white text-xl">Loading vendors...</div>
          </div>
        ) : vendors.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <h3 className="text-xl text-white mb-4">No vendors found</h3>
            <p className="text-gray-400 mb-6">
              Add your first vendor to start tracking payments and transactions
            </p>
            <button
              onClick={() => setShowAddVendor(true)}
              className="bg-green-500 hover:bg-green-600 px-6 py-2.5 rounded-lg text-white font-medium transition-all duration-200"
            >
              + Add Your First Vendor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-gray-800 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-blue-200/30 shadow-2xl shadow-blue-100/20 hover:translate-y-1"
              >
                <VendorCard vendor={vendor} />
                <div className="flex gap-3 p-4 flex-wrap h-12">
                  <button
                    onClick={() => {
                      setSelectedVendor(vendor);
                      setshowvendorForm(true);
                    }}
                    className="flex-1 bg-blue-500 h-10 hover:bg-blue-600 py-2.5 rounded-lg font-medium transition-all duration-200 text-white"
                  >
                    Update Details
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVendor(vendor);
                      setShowTransactionHistory(true);
                    }}
                    className="flex-1 bg-indigo-500 h-10 hover:bg-indigo-600 py-2.5 rounded-lg font-medium transition-all duration-200 text-white"
                  >
                    View History
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVendor(vendor);
                      setShowDeleteConfirm(true);
                    }}
                    className="flex-1 bg-red-600 h-10 hover:bg-red-700 py-2.5 rounded-lg font-medium transition-all duration-200 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddVendor && (
        <AddVendor
          onClose={() => setShowAddVendor(false)}
          onVendorAdded={handleFetchVendors}
        />
      )}
      {showvendorForm && selectedVendor && (
        <UpdateVendorForm
          selectedVendor={selectedVendor}
          setSelectedVendor={setSelectedVendor}
          setTotalDueAllVendors={setTotalDueAllVendors}
          onVendorUpdated={handleFetchVendors}
        />
      )}
      {showTransactionHistory && selectedVendor && (
        <VendorTransactionHistory
          vendor={selectedVendor}
          transactions={transactions}
          onClose={() => setShowTransactionHistory(false)}
        />
      )}
      {showDeleteConfirm && selectedVendor && (
        <DeleteVendor
          vendor={selectedVendor}
          onClose={() => setShowDeleteConfirm(false)}
          onVendorDeleted={handleFetchVendors}
        />
      )}
    </div>
  );
}

export default Vendor;
