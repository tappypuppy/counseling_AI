"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import Payment from "@/components/Payment/Payment";
export const Page = () => {
  return (
    <SessionProvider>
      <Payment />
    </SessionProvider>
  );
};
export default Page;
