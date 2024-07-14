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

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(jobPosition, jobDesc, jobExperience);
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
                        onChange={(e) => setJobPosition(e.target.value)}
                      />
                    </div>

                    <div className="my-3 flex flex-col gap-1">
                      <label htmlFor="" className="font-bold">
                        Job Description/Tech Stack (In Short)
                      </label>
                      <Textarea
                        placeholder="Ex. NextJS, React, .NetCore, SpringBoot"
                        required
                        onChange={(e) => setJobDesc(e.target.value)}
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
                        onChange={(e) => setJobExperience(e.target.value)}
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
                  <Button type="submit">Start Interview</Button>
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
