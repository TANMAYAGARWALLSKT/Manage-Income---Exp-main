import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { SparklesCore } from "../ui/sparkles";
import Incometable from "./Incometable";
import Expense from "./Expense/Expense";

import { NavLink } from "react-router-dom";

function Income() {
  const [activeTab, setActiveTab] = useState("income");

  return (
    <div>
      {/* <SparklesCore /> */}
      <div className="flex flex-col items-center gap-5 justify-center h-screen">
        <div className="flex flex-row items-center bg-zinc-800 rounded-lg px-1.5 py-2 justify-center gap-2">
          <motion.div
            whileTap={{ scale: 0.95 }}
            className={`cursor-pointer py-2 px-8  z-20 rounded-md text-2xl font-medium ${
              activeTab === "income"
                ? "bg-green-700 text-zinc-200"
                : "text-zinc-400 "
            }`}
            onClick={() => setActiveTab("income")}
          >
            Income
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.95 }}
            className={`cursor-pointer py-2 px-8 rounded-md z-20 text-2xl font-medium ${
              activeTab === "expense"
                ? "bg-red-700 text-zinc-200"
                : " text-zinc-400 "
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
            className="w-full z-40"
          >
            {activeTab === "income" && <Incometable />}
            {activeTab === "expense" && <Expense />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Income;
