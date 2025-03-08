import React, { useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../../utils/firebase";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Select,
  SelectItem,
  Input,
  Button,
  Spinner,
} from "@nextui-org/react";
import { PaymentModelist, typelist } from "../../data";
import ExportButton from "./Button_export";

import { DeleteIcon } from "./DeleteIcon.jsx";
import { EditIcon } from "./EditIcon.jsx";

export default function Booktable() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    EndDate: new Date().toLocaleDateString(),
    StartDate: new Date().toLocaleDateString(),
    paymentModeSelect: null,
    typeMode: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      if (filters.StartDate) {
        queryRef = query(queryRef, where("Date", "<=", filters.StartDate));
      }
      if (filters.paymentModeSelect) {
        queryRef = query(
          queryRef,
          where("PaymentMode", "==", filters.paymentModeSelect)
        );
      }

      if (filters.typeMode) {
        queryRef = query(queryRef, where("Type", "==", filters.typeMode));
      }

      const querySnapshot = await getDocs(queryRef);

      const tempData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(tempData);
    } catch (error) {
      console.warn("Error fetching data: ", error);
      setError("Error fetching data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchDataAndFilter();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value.target.value,
    }));
  };

  const deleteDocument = async (id) => {
    try {
      const docRef = doc(db, "Income", id.toString());
      await deleteDoc(docRef);
      console.log(`Document with ID ${id} has been deleted.`);
      // Optionally, refetch the data after deleting
      fetchDataAndFilter();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-2 sm:p-4 pb-5">
      <div className="noto-sans">
        <form onSubmit={handleFilterSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 my-4">
            <Input
              onChange={(e) => handleFilterChange("EndDate", e)}
              value={filters.EndDate}
              className="font-bold w-full"
              type="date"
              label="Start Date"
              placeholder="YYYY-MM-DD"
            />
            <Input
              onChange={(e) => handleFilterChange("StartDate", e)}
              value={filters.StartDate}
              className="font-bold w-full"
              type="date"
              label="End Date"
              placeholder="YYYY-MM-DD"
            />
            <Select
              value={filters.paymentModeSelect}
              onChange={(value) =>
                handleFilterChange("paymentModeSelect", value)
              }
              items={PaymentModelist}
              label="Payment Mode"
              placeholder="Select a Payment Mode"
              className="font-extrabold w-full"
              isClearable
            >
              {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
            </Select>
            <Select
              value={filters.typeMode}
              onChange={(value) => handleFilterChange("typeMode", value)}
              items={typelist}
              label="Type"
              placeholder="Select a Type"
              className="font-bold"
              isClearable
            >
              {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
            </Select>
            <Button
              type="submit"
              className="w-full h-12 text-zinc-100 font-bold text-base sm:text-lg"
              color="success"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Filter"}
            </Button>
            <Button
              type="button"
              className="w-full h-12 font-bold text-base sm:text-lg"
              color="danger"
              variant="flat"
              onClick={() => {
                setFilters({
                  EndDate: new Date().toLocaleDateString(),
                  StartDate: new Date().toLocaleDateString(),
                  paymentModeSelect: null,
                  typeMode: null,
                });
                fetchDataAndFilter();
              }}
            >
              Reset
            </Button>
          </div>
        </form>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="overflow-x-auto rounded-lg shadow">
          <Table
            aria-label="Transaction table"
            className="min-w-full bg-content1"
            classNames={{
              wrapper: "shadow-none",
            }}
          >
            <TableHeader>
              <TableColumn className="bg-default-200 text-sm sm:text-base font-bold">
                Date
              </TableColumn>
              <TableColumn className="bg-default-200 text-sm sm:text-base font-bold">
                MODEL
              </TableColumn>
              <TableColumn className="bg-default-200 text-sm sm:text-base font-bold">
                Amount
              </TableColumn>
              <TableColumn className="bg-default-200 text-sm sm:text-base font-bold">
                Type
              </TableColumn>
              <TableColumn className="bg-default-200 text-sm sm:text-base font-bold">
                Payment Mode
              </TableColumn>
              <TableColumn className="bg-default-200 text-sm sm:text-base font-bold">
                Notes
              </TableColumn>
              <TableColumn className="bg-default-200 w-4"></TableColumn>
            </TableHeader>
            <TableBody emptyContent={loading ? "Loading..." : "No data found"}>
              {data.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-default-100 transition-colors"
                >
                  <TableCell className="text-xs sm:text-sm font-medium">
                    {item.Date}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {item.Model}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm font-semibold">
                    ₹{Number(item.Amount).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs sm:text-sm text-white ${
                        item.Type === "Expense" ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {item.Type}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {item.PaymentMode}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm max-w-[200px] truncate">
                    {item.Notes}
                  </TableCell>
                  <TableCell>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-danger hover:text-danger-400"
                      onClick={() => deleteDocument(item.id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex justify-end">
          {data.length > 0 && <ExportButton data={data} />}
        </div>
      </div>
    </div>
  );
}
