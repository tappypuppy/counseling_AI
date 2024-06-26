"use client";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { postsState } from "@/state/postsState";
import TextareaForm from "@/components/Forum/PostForm/post";
import Likes from "@/components/Forum/board/likes";
import Post from "@/components/Forum/Post/Post";
import styles from "./ForumPage.module.css";

function ForumPage() {
  const [posts, setPosts] = useState([]); // posts = [{id: 1, message: "hello"}, {id: 2, message: "hi"}
  // const [_posts, setPostsState] = useRecoilState(postsState);

  useEffect(() => {
    fetch("/api/forum/post/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      });
  }, []);

  return (
    <div className={styles.inner}>
      <SessionProvider>
        <TextareaForm />
      </SessionProvider>
      <div className={styles.posts}>
        {posts
          .sort((a: { id: number }, b: { id: number }) => b.id - a.id)
          .map((post: { id: number; message: string }) => (
            <div key={post.id} className={styles.post}>
              <Post post_id={post.id} />
              <div className={styles.post_text}>{post.message}</div>
              <SessionProvider>
                <Likes post_id={post.id} />
              </SessionProvider>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ForumPage;
