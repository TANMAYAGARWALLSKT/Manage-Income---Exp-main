import React, { useState, useEffect } from "react";
import { db, auth } from "../../../Config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardBody } from "@nextui-org/react";

function Cashinhand() {
  const [cashInHand, setCashInHand] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("Fetching");
        const currentDate = new Date().toLocaleDateString();
        const userId = auth?.currentUser?.uid;

        const incomeRef = collection(db, "Income");
        const expenseRef = collection(db, "Expense");

        const incomeQuery = query(
          incomeRef,
          where("Date", "==", currentDate),
          where("PaymentMode", "==", "Cash"),
          where("userid", "==", userId)
        );

        const expenseQuery = query(
          expenseRef,
          where("Date", "==", currentDate),
          where("PaymentMode", "==", "Cash"),
          where("userid", "==", userId)
        );

        const [incomeSnapshot, expenseSnapshot] = await Promise.all([
          getDocs(incomeQuery),
          getDocs(expenseQuery),
        ]);

        let totalIncome = 0;
        let totalExpense = 0;

        incomeSnapshot.forEach((doc) => {
          totalIncome += parseFloat(doc.data().Amount);
        });

        expenseSnapshot.forEach((doc) => {
          totalExpense += parseFloat(doc.data().Amount);
        });

        setCashInHand(totalIncome - totalExpense);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error
      }
    };

    fetchData();
  }, []);

  return (
    <Card
      isBlurred
      className="hover:scale-110 bg-background/10 custom-blur dark:bg-blue-900/20 w-auto h-auto backdrop-blur-10 text-zinc-300 "
    >
      <CardBody>
        <div className="flex items-center justify-center p-3">
          <div className="flex ">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-0">
                <h3 className="text-blue-500 text-4xl font-bold">
                  Cash In hand
                </h3>
                <h1 className="text-5xl font-medium mt-10">{cashInHand} </h1>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default Cashinhand;
