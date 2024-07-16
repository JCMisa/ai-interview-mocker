"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const Header = () => {
  const path = usePathname(); //returns the path of this component which is /dashboard

  useEffect(() => {}, []);
  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-md">
      <div className="flex gap-2 items-center">
        <Image src={"/logo.svg"} width={40} height={20} alt="main logo" />
        <p className="font-bold text-lg text-primary">AIIM</p>
      </div>

      <ul className="hidden md:flex gap-6 text-sm">
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === "/dashboard" && "text-primary font-bold"
          }`}
        >
          Dashboard
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === "/dashboard/questions" && "text-primary font-bold"
          }`}
        >
          Questions
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === "/dashboard/upgrade" && "text-primary font-bold"
          }`}
        >
          Upgrade
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === "/dashboard/how" && "text-primary font-bold"
          }`}
        >
          How it Works?
        </li>
      </ul>
      <UserButton />
    </div>
  );
};

export default Header;
