import { atom } from "recoil";

export interface Post {
  id: number;
  userName: string;
  imageUrl: string;
  contents: string;
}

export const postsState = atom<Post[]>({
  key: "postsState",
  default: [
    //   {id:10, user_name: "user1", image_url: "https://www.gravatar.com/avatar/", contents: "Hello, World!"},
  ],
});
