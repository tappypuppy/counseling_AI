import { useEffect, useState } from "react";

import styles from "./Post.module.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostProps {
  post_id: number;
}

function Post(props: PostProps) {
  interface PostInfo {
    name: string;
    image: string;
  }

  const [postInfo, setPostInfo] = useState<PostInfo>();

  useEffect(() => {
    fetch("/api/forum/post/" + props.post_id + "/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPostInfo(data);
      });
  }, []);

  return (
    <div className={styles.container}>
      <Avatar className="w-8 h-8">
        {postInfo && (
          <AvatarImage src={postInfo?.image ?? ""} alt={postInfo?.name ?? ""} />
        )}
        <AvatarFallback>{postInfo?.name}</AvatarFallback>
      </Avatar>
      <div className={styles.name}>{postInfo && postInfo["name"]}</div>
    </div>
  );
}

export default Post;
