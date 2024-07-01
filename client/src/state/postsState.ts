import {atom} from 'recoil';

interface Post {
    user_name : string;
    image_url : string;
    contents : string;
}

export const postsState = atom<Post[]>({
    key: 'postsState',
    default: [
    //   {user_name: "user1", image_url: "https://www.gravatar.com/avatar/", contents: "Hello, World!"},
    ],
  });