"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

// this is where we display the interview response stored in neon db based on the mockId represented by interviewId
const Interview = ({ params }) => {
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  const getInterviewDetails = async () => {
    // this is a query where we select all records in neon db where the table MockInterview.mockId is equal to the interviewId passed in the url parameter stored in params props. result will return an array in which the index 0 is the properties of the record retrieved
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    setInterviewData(result[0]); // store the result[0] which is the object holding the properties of the record to the interviewData state
  };

  useEffect(() => {
    getInterviewDetails(); // this will fetch the interview details when the component mounts and re-fetches the data when the interviewId changes in the url parameters.
    // This ensures that the data is always up to date.
  }, []);

  return (
    <div className="my-10 flex justify-center flex-col">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5">
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              imageSmoothing={true}
              style={{
                height: 300,
                width: 800,
              }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border cursor-pointer" />
              <Button
                className="bg-accent text-gray-950 hover:text-white transition-all border shadow-sm"
                onClick={() => setWebCamEnabled(true)}
              >
                Enable Web Cam and Microphone
              </Button>
            </>
          )}
        </div>

        <div className="flex flex-col my-5 gap-5">
          <div className="p-5 rounded-lg border flex flex-col gap-5">
            <h2 className="text-sm">
              <strong>Job Role/Position:</strong> {interviewData?.jobPosition}
            </h2>
            <h2 className="text-sm">
              <strong>Job Description/Tech Stack:</strong>{" "}
              {interviewData?.jobDesc}
            </h2>
            <h2 className="text-sm">
              <strong>Years of Experience:</strong>{" "}
              {interviewData?.jobExperience}
            </h2>
          </div>
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-500">
              <Lightbulb /> <strong>Information</strong>
            </h2>
            <h2 className="mt-3 text-sm text-gray-800">
              {process.env.NEXT_PUBLIC_INFORMATION}
            </h2>
          </div>
        </div>
      </div>
      <div className="flex justify-end items-end">
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
};

export default Interview;
