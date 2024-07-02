"use client";
import { RecoilRoot } from "recoil";
import ForumPage from "@/components/Forum/ForumPage/ForumPage ";
function Page() {
  return (
    <div>
      <RecoilRoot>
        <ForumPage />
      </RecoilRoot>
    </div>
  );
}

export default Page;
