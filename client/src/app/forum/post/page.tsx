import TextareaForm from "@/components/Forum/PostForm/post";
import { SessionProvider } from "next-auth/react";
function page() {
  return (
    <SessionProvider>
      <TextareaForm />
    </SessionProvider>
  );
}

export default page;
