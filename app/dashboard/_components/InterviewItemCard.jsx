import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const InterviewItemCard = ({ interview }) => {
  const router = useRouter();

  return (
    <div className="border shadow-sm rounded-lg p-3">
      <h2 className="font-bold text-primary">{interview?.jobPosition}</h2>
      <h2 className="text-sm text-gray-600">
        {interview?.jobExperience} Years of Experience
      </h2>
      <h2 className="text-xs text-gray-400">
        Created at: {interview?.createdAt}
      </h2>

      <div className="flex justify-between mt-2 gap-5">
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() =>
            router.push(`dashboard/interview/${interview?.mockId}/feedback`)
          }
        >
          Feedback
        </Button>
        <Button
          size="sm"
          className="w-full"
          onClick={() =>
            router.push(`dashboard/interview/${interview?.mockId}/start`)
          }
        >
          Start
        </Button>
      </div>
    </div>
  );
};

export default InterviewItemCard;
