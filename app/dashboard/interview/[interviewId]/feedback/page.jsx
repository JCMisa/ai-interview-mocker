"use client";

import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Feedback = ({ params }) => {
  const router = useRouter();

  const [feedbackList, setFeedbackList] = useState([]);

  const GetFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    console.log("feedback list: ", result);
    setFeedbackList(result);
  };

  useEffect(() => {
    GetFeedback();
  }, []);

  const goodRating = [
    "ok",
    "okay",
    "pretty good",
    "good",
    "3",
    "4",
    "5",
    "nice",
    "acceptable",
  ];

  return (
    <div className="p-10">
      {feedbackList?.length > 0 ? (
        <div>
          <h2 className="text-3xl font-bold text-green-500">
            Congratulations! 🎉
          </h2>
          <h2 className="font-bold text-lg">Here is your interview result</h2>
          <h2 className="text-primary text-md my-3 flex gap-1 flex-row">
            Your overall rating summary:{" "}
            {feedbackList.map((item, index) => (
              <strong key={item.id}>
                ({item.rating}){index !== feedbackList.length - 1 ? ", " : ""}
              </strong>
            ))}
          </h2>
          <h2 className="text-xs text-gray-500">
            Kindly click each interview question to check more information about
            the result of your answer.
          </h2>

          {feedbackList &&
            feedbackList.map((item, index) => (
              <Collapsible key={index} className="mt-5">
                <CollapsibleTrigger className="p-2 bg-secondary rounded-lg my-2 flex justify-between items-start text-left w-full">
                  {item.question} <ChevronsUpDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="text-sm px-10 flex flex-col gap-2">
                    <h2
                      className={`${
                        goodRating.includes(
                          item.rating?.toString().toLowerCase()
                        )
                          ? "text-green-500"
                          : "text-red-500"
                      } p-2 border rounded-lg`}
                    >
                      <strong>Rating: </strong>
                      {item.rating}{" "}
                      {goodRating.includes(
                        item.rating?.toString().toLowerCase()
                      )
                        ? "😎"
                        : "😓"}
                    </h2>

                    <h2 className="p-2 border rounded-lg text-xs text-primary bg-purple-100">
                      <strong>Your Answer: </strong>
                      {item.userAns}
                    </h2>

                    <h2 className="p-2 border rounded-lg text-xs text-green-900 bg-green-100">
                      <strong>Expected Answer: </strong>
                      {item.correctAns}
                    </h2>

                    <h2 className="p-2 border rounded-lg text-xs text-yellow-900 bg-yellow-100">
                      <strong>Feedback: </strong>
                      {item.feedback}
                    </h2>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}

          <Button onClick={() => router.replace("/dashboard")}>Go Home</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-primary">
            You don&apos;t have any feedback for this specific interview
          </h2>
          <Button onClick={() => router.replace("/dashboard")}>Go Home</Button>
        </div>
      )}
    </div>
  );
};

export default Feedback;
