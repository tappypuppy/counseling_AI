"use client";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { postsState } from "@/state/postsState";
import TextareaForm from "@/components/Forum/PostForm/post";
import Likes from "@/components/Forum/board/likes";
import styles from "./ForumPage.module.css";

function ForumPage() {
  // const [_posts, setPosts] = useState([]); // posts = [{id: 1, message: "hello"}, {id: 2, message: "hi"}
  const [posts, setPostsState] = useRecoilState(postsState);

  useEffect(() => {
    fetch("/api/forum/post/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // setPosts(data);
        const newPosts = data.map((post: { id: number; profiles: { name: string; image_url: string; }; message: string; }) => ({
          id: post.id,
          userName: post.profiles.name,
          imageUrl: post.profiles.image_url,
          contents: post.message
        }));
        console.log(newPosts)
        setPostsState(prevPosts => [...prevPosts, ...newPosts])
      });
  }, []);

  return (
    <div className={styles.inner}>
      <SessionProvider>
        <TextareaForm />
      </SessionProvider>
      <div className={styles.posts}>
        {posts
          // .sort((a: { id: number }, b: { id: number }) => b.id - a.id) // Sort posts by id in descending order
          .map((post: { id: number; userName: string, imageUrl: string, contents: string}) => (
            <div key={post.id} className={styles.post}>
              <div className={styles.container}>
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={post.imageUrl}
                    alt={post.imageUrl}
                  />

                  <AvatarFallback>{post.userName}</AvatarFallback>
                </Avatar>
                <div className={styles.name}>{post.userName}</div>
              </div>
              {/* <Post post_id={post.id} /> */}
              <div className={styles.post_text}>{post.contents}</div>
              <SessionProvider>
                <Likes post_id={post.id} />
              </SessionProvider>
            </div>
          ))
          .reverse()
          }
      </div>
    </div>
  );
}

export default ForumPage;
