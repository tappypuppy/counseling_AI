"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSadTear } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import styles from "./likes.module.css";
import { set } from "react-hook-form";

interface LikesProps {
  post_id: number;
}

function Likes(props: LikesProps) {
  const [isLike, setisLike] = useState<boolean | null>(null);
  const [likeCount, setLikeCount] = useState<number>(0); // いいね数
  const { data: session, status } = useSession();

  //   console.log("SESSION:", session?.user?.email);

  useEffect(() => {
    if (!session) {
      return;
    }

    fetch("/api/forum/like_count/" + props.post_id + "/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Cache-Control": "no-store",
      },
    })
      .then((res) => res.json())
      .then((count) => {
        setLikeCount(count);
        console.log("COUNT:", count);
      });

    const user_email = session?.user?.email;
    console.log("USER_EMAIL:", user_email);
    fetch("/api/forum/isLike/" + props.post_id + "/" + user_email + "/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Cache-Control": "no-store",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          setisLike(false);
        } else {
          setisLike(true);
        }
      });
  }, [session]);

  const handleClick = async () => {
    if (!session) {
      return;
    }
    if (isLike === null || isLike === false) {
      const res = await fetch("/api/forum/like/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          post_id: props.post_id,
          userEmail: session?.user?.email,
        }),
      });
      setisLike(true);
      setLikeCount(likeCount + 1);
    } else {
      const res = await fetch("/api/forum/like/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          post_id: props.post_id,
          userEmail: session?.user?.email,
        }),
      });
      setisLike(false);
      setLikeCount(likeCount - 1);
    }

    console.log(props.post_id);
    return console.log("clicked");
  };

  return (
    <div className={styles.inner}>
      <button onClick={handleClick}>
        <FontAwesomeIcon icon={faSadTear} color={isLike ? "skyblue" : "grey"} />
      </button>
      <span>{likeCount}</span>
    </div>
  );
}

export default Likes;
