"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import Payment from "@/components/Payment/Payment";
export default function Home() {
  return (
    <SessionProvider>
      <Payment />
    </SessionProvider>
  );
};
