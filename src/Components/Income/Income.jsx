import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Incometable from "./Incometable";
import Expense from "./Expense/Expense";

function Income() {
  const [activeTab, setActiveTab] = useState("income");

  return (
    <div className="flex flex-col items-center gap-5 justify-center min-h-screen p-4">
      <div className="flex flex-row items-center bg-zinc-800 rounded-lg px-2 py-2 justify-center gap-2 w-full max-w-md">
        <motion.div
          whileTap={{ scale: 0.95 }}
          className={`cursor-pointer py-2 px-6 md:px-8 w-full text-center rounded-md text-lg md:text-2xl font-medium transition-all duration-200 ${
            activeTab === "income"
              ? "bg-green-700 text-zinc-200"
              : "text-zinc-400"
          }`}
          onClick={() => setActiveTab("income")}
        >
          Income
        </motion.div>
        <motion.div
          whileTap={{ scale: 0.95 }}
          className={`cursor-pointer py-2 px-6 md:px-8 w-full text-center rounded-md text-lg md:text-2xl font-medium transition-all duration-200 ${
            activeTab === "expense"
              ? "bg-red-700 text-zinc-200"
              : "text-zinc-400"
          }`}
          onClick={() => setActiveTab("expense")}
        >
          Expense
        </motion.div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.1 }}
          className="w-full max-w-3xl"
        >
          {activeTab === "income" && <Incometable />}
          {activeTab === "expense" && <Expense />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Income;
