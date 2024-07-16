"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";

const StartInterview = ({ params }) => {
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [activeQuestionIndex, setactiveQuestionIndex] = useState(0);

  const getInterviewDetails = async () => {
    // this is a query where we select all records in neon db where the table MockInterview.mockId is equal to the interviewId passed in the url parameter stored in params props. result will return an array in which the index 0 is the properties of the record retrieved
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    const jsonMockResp = JSON.parse(result[0].jsonMockResp); // this will set the jsonMockResp property which is the array of generated response from gemini to a variable
    console.log("jsonMockResp property: ", jsonMockResp);
    setMockInterviewQuestion(jsonMockResp); // the variable jsonMockResp will then be stored in mockInterviewQuestion state variable
    setInterviewData(result[0]); // the whole record rith mockId equal to params interviewId will be stored in interviewData state variable
  };

  useEffect(() => {
    getInterviewDetails(); // call the method every first render of the component
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* questions */}
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        {/* video/audio recording */}
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>
    </div>
  );
};

export default StartInterview;
