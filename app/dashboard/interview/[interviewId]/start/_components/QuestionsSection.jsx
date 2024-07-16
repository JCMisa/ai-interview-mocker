"use client";

import { Button } from "@/components/ui/button";
import { Lightbulb, Volume1, Volume2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const QuestionsSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
  const [speaking, setSpeaking] = useState(false);
  // this method will start your device speaker and read the text passed as parameter
  const textToSpeech = (text) => {
    setSpeaking(true);

    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
      setTimeout(() => {
        setSpeaking(false);
      }, 10000);
    } else {
      toast("Sorry, your browser does not support text to speech");
    }
  };

  return (
    mockInterviewQuestion && (
      <div className="p-5 border rounded-lg my-10">
        <div
          className="grid grid-cols-2 md:gridcol3
       lg:grid-cols-4 gap-5"
        >
          {mockInterviewQuestion.map((question, index) => (
            <h2
              key={index}
              className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${
                activeQuestionIndex == index && "text-primary"
              }`}
            >
              Question #{index + 1}
            </h2>
          ))}
        </div>
        <h2 className="my-5 text-sm md:text-lg">
          {/* access the
          question property of the element at index number equal to
          activeQuestionIndex props */}
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>

        <div
          onClick={() =>
            textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)
          }
        >
          {speaking ? (
            <Button disabled className="rounded-full flex items-center">
              <Volume2 />
            </Button>
          ) : (
            <Button className="rounded-full flex items-center">
              <Volume1 className="cursor-pointer" />
            </Button>
          )}
        </div>

        <div className="border rounded-lg p-5 bg-blue-100 mt-20">
          <h2 className="flex gap-2 items-center text-primary">
            <Lightbulb />
            <strong>Note:</strong>
          </h2>
          <h2 className="text-xs text-primary my-2">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </h2>
        </div>
      </div>
    )
  );
};

export default QuestionsSection;
