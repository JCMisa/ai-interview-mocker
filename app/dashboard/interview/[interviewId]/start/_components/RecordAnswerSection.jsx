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
  interviewData,
}) => {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    results.map((result) =>
      setUserAnswer((prevAns) => prevAns + result?.transcript)
    );
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
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

    const JsonFeedbackResp = JSON.parse(mockJsonResp);

    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: mockInterviewQuestion[activeQuestionIndex]?.question,
      correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
      userAns: userAnswer,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("DD-MM-yyyy"),
    });

    if (resp) {
      toast(
        <div className="text-green-500 text-sm">
          User answer saved successfully!
        </div>
      );
    }
    setUserAnswer("");
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex flex-col justify-center items-center bg-violet-300 rounded-lg p-5 mt-20">
        <Image
          src={"/webcam.png"}
          width={300}
          height={300}
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
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
