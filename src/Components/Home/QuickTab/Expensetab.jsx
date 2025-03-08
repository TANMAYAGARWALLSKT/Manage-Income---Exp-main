import React, { useState, useEffect } from "react";
import { db, auth } from "../../../Config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardBody } from "@nextui-org/react";

function Expensetab() {
  const [totalAmount, setTotalAmount] = useState(0); // State to hold the total amount

  const [date, setDate] = useState(new Date().toLocaleDateString());
  const typeData = "Expense";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataRef = collection(db, "Income");
        const q = query(
          dataRef,
          where("Date", "==", date),
          where("Type", "==", typeData),
          where("userid", "==", auth?.currentUser?.uid)
        );
        const querySnapshot = await getDocs(q);

        // Calculate the total amount
        let total = 0;
        querySnapshot.forEach((doc) => {
          total += parseFloat(doc.data().Amount); // Assuming the amount field is named "amount"
        });

        // Update the total amount state
        setTotalAmount(total);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [date]);

  useEffect(() => {
    setDate(new Date().toLocaleDateString());
  }, []);
  return (
    <Card
      isBlurred
      className=" hover:scale-110  custom-blur bg-background/10  dark:bg-red-600/40 backdrop-blur-10  text-zinc-300 max-w-[610px]"
    >
      <CardBody className="">
        <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center p-3 ">
          <div className="flex flex-col col-span-6 md:col-span-8">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-0">
                <h3 className="text-red-500/90 text-4xl font-bold">
                  Cash Out -
                </h3>

                <h1 className=" text-5xl font-medium mt-10">
                  {" "}
                  - {totalAmount}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default Expensetab;
