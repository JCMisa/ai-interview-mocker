import { UserButton } from "@clerk/nextjs";
import React from "react";

const Dashboard = () => {
  return (
    <div>
      <UserButton /> // displays the user icon where you can click it and sign
      out your account from clerk
    </div>
  );
};

export default Dashboard;
