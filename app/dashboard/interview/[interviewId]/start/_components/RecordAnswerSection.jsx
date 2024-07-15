"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";

const RecordAnswerSection = () => {
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

  const [userAnswer, setuserAnswer] = useState("");

  useEffect(() => {
    results.map((result) =>
      setuserAnswer((prevAns) => prevAns + result?.transcript)
    );
  }, [results]);

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

      <Button
        className="my-10"
        onClick={isRecording ? stopSpeechToText : startSpeechToText} // if recording then stop it if you want, then if not recording then start it
      >
        {isRecording ? (
          <div className="text-red-300 flex flex-row gap-2 items-center">
            <Mic /> Recording...
          </div>
        ) : (
          "Record Answer"
        )}
      </Button>

      <Button onClick={() => console.log(userAnswer)}>Show user answer</Button>
    </div>
  );
};

export default RecordAnswerSection;
