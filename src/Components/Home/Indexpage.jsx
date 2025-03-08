import React, { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../utils/firebase";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Indexpage() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    EndDate: new Date().toLocaleDateString(),
    StartDate: new Date().toLocaleDateString(),
    paymentModeSelect: null,
    typeMode: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
    dues: 0,
  });

  const fetchDataAndFilter = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const selectData = collection(db, "Income");
      let queryRef = query(
        selectData,
        where("Date", ">=", filters.EndDate),
        where("userid", "==", auth?.currentUser?.uid)
      );
      if (filters.StartDate)
        queryRef = query(queryRef, where("Date", "<=", filters.StartDate));
      if (filters.paymentModeSelect)
        queryRef = query(
          queryRef,
          where("PaymentMode", "==", filters.paymentModeSelect)
        );
      if (filters.typeMode)
        queryRef = query(queryRef, where("Type", "==", filters.typeMode));

      const querySnapshot = await getDocs(queryRef);
      const tempData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const calculatedTotals = tempData.reduce(
        (acc, item) => {
          const amount = Number(item.Amount) || 0;
          if (item.Type === "Income") {
            item.PaymentMode === "Due"
              ? (acc.dues += amount)
              : (acc.income += amount);
          } else if (item.Type === "Expense") {
            item.PaymentMode === "Due"
              ? (acc.dues += amount)
              : (acc.expenses += amount);
          }
          return acc;
        },
        { income: 0, expenses: 0, dues: 0 }
      );

      calculatedTotals.balance =
        calculatedTotals.income - calculatedTotals.expenses;

      setTotals(calculatedTotals);
      setData(tempData);
    } catch (error) {
      setError("Error fetching data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDataAndFilter();
  }, [fetchDataAndFilter]);

  const chartData = {
    labels: data.map((item) => item.Date),
    datasets: [
      {
        label: "Income",
        data: data
          .filter((item) => item.Type === "Income")
          .map((item) => item.Amount),
        borderColor: "rgb(16, 185, 129)",
        tension: 0.1,
      },
      {
        label: "Expenses",
        data: data
          .filter((item) => item.Type === "Expense")
          .map((item) => item.Amount),
        borderColor: "rgb(239, 68, 68)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="flex flex-col items-center w-full h-full pt-4 sm:pt-6 overflow-y-scroll bg-black">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-gray-300/20 py-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-300">
              Dashboard Overview
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Track your financial activities
            </p>
          </div>
          <div className="border-2 border-gray-300 rounded-full w-10 h-10"></div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {["Income", "Expenses", "Balance", "Dues"].map((type, index) => (
            <div
              key={index}
              className={`flex-1 min-w-[250px] p-1 border-2 shadow-lg rounded-xl
              ${
                type === "Income"
                  ? "border-emerald-500 shadow-emerald-500/50"
                  : type === "Expenses"
                  ? "border-red-500 shadow-red-700/50"
                  : type === "Balance"
                  ? "border-blue-500 shadow-blue-500/50"
                  : "border-orange-500 shadow-red-500/50"
              }`}
            >
              <div className="backdrop-blur-md bg-white/10 p-4 sm:p-6 rounded-lg">
                <h3 className="text-xs sm:text-sm text-gray-300">{`Total ${type}`}</h3>
                <p
                  className={`text-xl sm:text-2xl font-bold 
                  ${
                    type === "Income"
                      ? "text-emerald-500"
                      : type === "Expenses"
                      ? "text-red-500"
                      : type === "Balance"
                      ? "text-blue-500"
                      : "text-orange-500"
                  }`}
                >
                  ₹{totals[type.toLowerCase()].toLocaleString()}
                </p>
                <span className="text-xs text-gray-400">Current Period</span>
              </div>
            </div>
          ))}
        </div>

        {/* Transactions & Chart */}
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Recent Transactions */}
          <div className="w-full lg:w-[30%] h-auto max-h-[500px] overflow-y-auto bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Transactions
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {data.map((item, index) => (
                <div key={index} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.Model || item.Notes}
                    </h3>
                    <p
                      className={`text-sm font-medium ${
                        item.Type === "Income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.Type === "Income" ? "+" : "-"}₹{item.Amount}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">{item.Date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 backdrop-blur-md bg-white/10 rounded-xl border-2 border-gray-500/30 shadow-lg p-6">
            <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px]">
              <Line
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: "#e5e7eb" } },
                    title: {
                      display: true,
                      text: "Financial Trends",
                      color: "#e5e7eb",
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        color: "#e5e7eb",
                        callback: (value) => `₹${value.toLocaleString()}`,
                      },
                    },
                    x: { ticks: { color: "#e5e7eb" } },
                  },
                }}
                data={chartData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Indexpage;
