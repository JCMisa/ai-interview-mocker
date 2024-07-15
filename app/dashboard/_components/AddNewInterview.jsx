"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);

  const router = useRouter();

  const { user } = useUser(); // get the current logged in user

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition, jobDesc, jobExperience);

    const InputPrompt = `Job Position: ${jobPosition}, Job Description ${jobDesc}, Years of Experience: ${jobExperience}, depends on job position, description, and experience, generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with answer per each question in json format where question and answer are both key with their respective values`;

    const result = await chatSession.sendMessage(InputPrompt); // this will generate the response based on InputPromt question

    // store the response in MockJsonResp and manipulate the response like replacing the unecessary text and parse it through JSON format
    const MockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    console.log(JSON.parse(MockJsonResp));
    setJsonResponse(MockJsonResp); // save the response to jsonResponse state

    //store in db
    if (MockJsonResp) {
      const resp = await db
        .insert(MockInterview) // MockInterview is the table inside /utils.schema
        .values({
          // this are the values set to the properties
          mockId: uuidv4(), // uuidv4 is the library that generates random string as id
          jsonMockResp: MockJsonResp, // set the response to jsonMockResp property
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress, // get the email of logged in user
          createdAt: moment().format("DD-MM-yyyy"), // moment is a library that generates current date which will be the value of createdAt
        })
        .returning({ mockId: MockInterview.mockId }); // this will return the mockId generated through uuid (which will be used to access in other page)

      console.log("Inserted ID: ", resp);

      if (resp) {
        setOpenDialog(false);
        router.push(`/dashboard/interview/${resp[0]?.mockId}`);
      }
    } else {
      console.log("error occured");
    }

    setLoading(false);
  };

  return (
    <div>
      <div
        onClick={() => setOpenDialog(true)}
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Tell us more about your job interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add details about your job position/role, job description,
                    and years of experience
                  </h2>
                  <div className="flex flex-col gap-2">
                    <div className="mt-7 my-2 flex flex-col gap-1">
                      <label htmlFor="" className="font-bold">
                        Job Role/Position
                      </label>
                      <Input
                        placeholder="Ex. Full Stack Developer"
                        required
                        onChange={(e) => setJobPosition(e.target.value)} // set the input value to the state
                      />
                    </div>

                    <div className="my-3 flex flex-col gap-1">
                      <label htmlFor="" className="font-bold">
                        Job Description/Tech Stack (In Short)
                      </label>
                      <Textarea
                        placeholder="Ex. NextJS, React, .NetCore, SpringBoot"
                        required
                        onChange={(e) => setJobDesc(e.target.value)} // set the input value to the state
                      />
                    </div>

                    <div className="my-3 flex flex-col gap-1">
                      <label htmlFor="" className="font-bold">
                        Years of Experience
                      </label>
                      <Input
                        placeholder="Ex. 5"
                        type="number"
                        max="50"
                        required
                        onChange={(e) => setJobExperience(e.target.value)} // set the input value to the state
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-5 justify-end mt-2">
                  <Button
                    onClick={() => setOpenDialog(false)}
                    variant="ghost"
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" /> Generating
                        Response
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
