import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Component that provides CSV export functionality for vendor transactions
 * @param {Array} transactions - Array of transaction objects
 * @param {String} vendorName - Name of the vendor for the file name
 */
const DownloadButton = ({ transactions, vendorName }) => {
  const handleDownload = () => {
    if (!transactions || transactions.length === 0) return;

    // Create CSV content with headers
    const headers = "Transaction Type,Date,Amount,Item\n";
    const csvContent = transactions
      .map((transaction) => {
        // Determine transaction type based on property existence
        const type = transaction.hasOwnProperty("item") ? "Purchase" : "Payment";
        const date = transaction.date
          ? new Date(transaction.date).toLocaleDateString()
          : "Unknown";
        const amount = transaction.amount || 0;
        const item = transaction.item || "N/A";

        return `${type},${date},₹${amount},${item}`;
      })
      .join("\n");

    // Create and trigger download
    const fullContent = headers + csvContent;
    const blob = new Blob([fullContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${vendorName}_transactions.csv`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!transactions || transactions.length === 0}
      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Export to CSV
    </button>
  );
};

/**
 * Component that renders transaction history for a specific vendor
 * 
 * @param {Object} vendor - Vendor object containing transaction data
 * @param {Array} transactions - Array of transactions from parent component (not used in current implementation)
 * @param {Function} onClose - Function to close the modal
 */
function VendorTransactionHistory({ vendor, transactions: externalTransactions, onClose }) {
  // Component state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);

  /**
   * Process vendor transaction data and handle errors
   */
  useEffect(() => {
    try {
      // Validate vendor data
      if (!vendor) {
        setError("No vendor data provided");
        setIsLoading(false);
        return;
      }

      // Process vendor data
      const paymentTransactions = (vendor.PaymentTransactions || []).map(tx => ({
        ...tx, 
        type: "payment"
      }));
      
      const purchaseTransactions = (vendor.PurchaseTransactions || []).map(tx => ({
        ...tx, 
        type: "purchase"
      }));

      // Combine and filter transactions (remove transactions with 0 amount)
      const combinedTransactions = [
        ...paymentTransactions,
        ...purchaseTransactions
      ].filter((transaction) => transaction && transaction.amount > 0);

      setTransactions(combinedTransactions);
      setIsLoading(false);
    } catch (err) {
      console.error("Error processing vendor data:", err);
      setError("Failed to process vendor transaction data");
      setIsLoading(false);
    }
  }, [vendor]);

  /**
   * Formats a number as Indian currency (INR)
   * @param {Number} amount - Amount to format
   * @returns {String} Formatted currency string
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  /**
   * Returns the appropriate CSS class for transaction type
   * @param {Object} transaction - Transaction object
   * @returns {String} CSS class name
   */
  const getTransactionTypeClass = (transaction) => {
    return transaction.type === 'purchase' || transaction.hasOwnProperty("item")
      ? "border-l-4 border-orange-500"
      : "border-l-4 border-blue-500";
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="bg-[#1B1B1B] text-white p-6 rounded-lg w-full max-w-3xl mx-4 shadow-xl relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header Section */}
          <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="mr-2">{vendor?.Name || "Vendor"}'s Transactions</span>
              {transactions.length > 0 && (
                <span className="text-sm bg-gray-700 px-2 py-1 rounded-full">
                  {transactions.length} total
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content Section */}
          <div className="mb-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-900 bg-opacity-30 p-4 rounded-lg text-center">
                <p className="text-red-400">{error}</p>
              </div>
            ) : transactions.length > 0 ? (
              <div>
                {/* Transaction list */}
                <div className="overflow-y-auto max-h-96 pr-2">
                  <ul className="space-y-4">
                    {transactions.map((transaction, index) => (
                      <li
                        key={index}
                        className={`p-4 bg-gray-800 bg-opacity-50 rounded-md ${getTransactionTypeClass(
                          transaction
                        )}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <span className="text-lg font-semibold">
                                {formatCurrency(transaction.amount)}
                              </span>
                              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                transaction.type === 'purchase' || transaction.hasOwnProperty("item") 
                                  ? "bg-orange-900 text-orange-100" 
                                  : "bg-blue-900 text-blue-100"
                              }`}>
                                {transaction.type === 'purchase' || transaction.hasOwnProperty("item")
                                  ? "Purchase"
                                  : "Payment"}
                              </span>
                            </div>
                            {transaction.item && (
                              <p className="text-gray-300 mt-1">
                                Item: {transaction.item}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">
                              {transaction.date
                                ? new Date(transaction.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )
                                : "Unknown date"}
                            </p>
                            {transaction.date && (
                              <p className="text-xs text-gray-500">
                                {new Date(transaction.date).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 p-6 rounded-md text-center">
                <svg
                  className="w-12 h-12 mx-auto text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-2 text-gray-400">
                  No transactions found for this vendor.
                </p>
              </div>
            )}
          </div>

          {/* Footer with Summary and Download Button */}
          <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              {transactions.length > 0 && (
                <p>
                  <span className="font-semibold">Summary:</span> {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} |
                  Total Amount:{" "}
                  <span className="font-semibold">
                    {formatCurrency(
                      transactions.reduce(
                        (sum, transaction) => sum + (transaction.amount || 0),
                        0
                      )
                    )}
                  </span>
                </p>
              )}
            </div>
            <DownloadButton
              transactions={transactions}
              vendorName={vendor?.Name || "Vendor"}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default VendorTransactionHistory;
