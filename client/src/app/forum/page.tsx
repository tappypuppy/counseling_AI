'use client';
import TextareaForm from "@/components/Forum/PostForm/post";
import { SessionProvider } from "next-auth/react";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

function Page() {

    const [posts, setPosts] = useState([]); // posts = [{id: 1, message: "hello"}, {id: 2, message: "hi"}

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
    }, [posts]);

  return (
    <div className={styles.inner}>
        <SessionProvider>
            <TextareaForm />
        </SessionProvider>
        <div className={styles.posts}>
            {posts.map((post: { id: number, message: string }) => (
                    <div key={post.id} className={styles.post}>{post.message}</div>
            ))}
            
        </div>
    </div>
  );
}

export default Page;
