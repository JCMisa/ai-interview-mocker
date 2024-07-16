"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData, // it was the record found by mockId in page.jsx of start directory
}) => {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(false);

  useEffect(() => {
    results.map(
      (result) => setUserAnswer((prevAns) => prevAns + result?.transcript) // append the result transcript to the empty string of userAnswer state
    );
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      // it means the user is not recording and the userAnswer state is not empty string
      UpdateUserAnswer();
    }
    // if (userAnswer?.length < 10) {
    //   setLoading(false);
    //   toast(
    //     <div className="text-red-500 text-sm">
    //       Error while saving your answer, Please record again.
    //     </div>
    //   );
    //   return;
    // }
  }, [userAnswer]);

  // this is the method the checks if the device is recording then stop it on click, otherwise start recording
  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    console.log(userAnswer);
    setLoading(true);

    const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, User Answer: ${userAnswer}, Depends on question and user answer for given question, please give us the rating for the answer, and a short feedback to the answer if it needs improvement or not, in just 3 to 5 sentences in JSON format with rating and feedback properties with their corresponding values.`;

    const result = await chatSession.sendMessage(feedbackPrompt);

    const mockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    // console.log("Feedback Response: ", JSON.parse(mockJsonResp));
    console.log(mockJsonResp);

    const JsonFeedbackResp = JSON.parse(mockJsonResp); // store the object response of the gemini api that has feedback and rating properties

    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId, // this is the mockId from the interviewData which is found by id in page.jsx of start directory
      question: mockInterviewQuestion[activeQuestionIndex]?.question,
      correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
      userAns: userAnswer, // this is the record transcript appended to the userAnswer empty string state
      feedback: JsonFeedbackResp?.feedback, // accessing the feedback property of the gemini api response
      rating: JsonFeedbackResp?.rating, // accessing the rating property of the gemini api response
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("DD-MM-yyyy"),
    });

    if (resp) {
      // checks if the record was added to the UserAnswer table
      toast(
        <div className="text-green-500 text-sm">
          User answer saved successfully!
        </div>
      );
      setUserAnswer(""); // make the userAnswer state empty again
      setResults([]); // set the result transcript array to and empty array
    }
    setResults([]);
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex flex-col justify-center items-center bg-violet-300 rounded-lg p-5 mt-20">
        {webcamEnabled ? (
          <Webcam
            onUserMedia={() => setWebcamEnabled(true)}
            onUserMediaError={() => setWebcamEnabled(false)}
            mirrored={true}
            style={{
              height: 300,
              width: "100%",
              zIndex: 10,
            }}
          />
        ) : (
          <Image
            src={"/webcam.png"}
            width={300}
            height={300}
            className="absolute cursor-pointer"
            onClick={() => setWebcamEnabled(true)}
          />
        )}
      </div>

      <div className="flex flex-row gap-2 justify-between">
        <Button
          disabled={loading}
          variant="outline"
          className="my-10"
          onClick={StartStopRecording} // if recording then stop it if you want, then if not recording then start it
        >
          {isRecording ? (
            <div className="text-red-300 flex flex-row gap-2 items-center">
              <Mic /> Stop Recording
            </div>
          ) : (
            <div className="text-primary border-primary flex flex-row gap-2 items-center">
              <Mic /> Record Answer
            </div>
          )}
        </Button>

        {/* <Button className="my-10" onClick={() => console.log(userAnswer)}>
          Show user answer
        </Button> */}
      </div>
    </div>
  );
};

export default RecordAnswerSection;
