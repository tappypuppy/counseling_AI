"use client";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { postsState } from "@/state/postsState";
import TextareaForm from "@/components/Forum/PostForm/post";
import Likes from "@/components/Forum/board/likes";
import Post from "@/components/Forum/Post/Post";
import ForumPage from "@/components/Forum/ForumPage/ForumPage ";
import styles from "./page.module.css";

function Page() {
  return (
    <div>
      <ForumPage />
    </div>
  );
}

export default Page;
