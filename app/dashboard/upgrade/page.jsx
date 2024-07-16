import { Button } from "@/components/ui/button";
import { planData } from "@/utils/planData";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="p-10 flex flex-col justify-center items-center">
      <h2 className="text-xl font-bold">Upgrade</h2>
      <p className="text-xs text-gray-500">
        Upgrade to monthly plan to access unlimited mock interview
      </p>
      <div className="flex md:flex-row sm:flex-col mt-10 gap-5">
        {/* free */}
        <div className="border shadow-md p-10 flex flex-col items-center justify-center gap-3 my-4 text-xs">
          <h2 className="text-md font-bold">Free</h2>
          <h2 className="text-xl font-bold">
            $0.00 <span className="text-xs">/month</span>
          </h2>
          <div className="flex flex-col gap-2 mt-4">
            {planData[0].offering.map((freePlan) => (
              <div className="flex flex-col gap-2">{freePlan.value}</div>
            ))}
          </div>
          <Button
            variant="outline"
            className="py-2 px-10 border-primary text-primary text-sm rounded-full w-full font-bold mt-3"
          >
            Get Started
          </Button>
        </div>

        {/* monthly */}
        <div className="border shadow-md p-10 flex flex-col items-center justify-center gap-3 my-4 text-xs">
          <h2 className="text-md font-bold">Monthly</h2>
          <h2 className="text-xl font-bold">
            $7.99 <span className="text-xs">/month</span>
          </h2>
          <div className="flex flex-col gap-2 mt-4">
            {planData[1].offering.map((paidPlan) => (
              <div className="flex flex-col gap-2">{paidPlan.value}</div>
            ))}
          </div>
          <Link href={`${planData[1].paymentLink}`} target="_blank">
            <Button
              variant="outline"
              className="py-2 px-10 border-primary text-primary text-sm rounded-full w-full font-bold mt-3"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
