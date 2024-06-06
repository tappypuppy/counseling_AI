import TextareaForm from "@/components/Forum/PostForm/post";
import { SessionProvider } from "next-auth/react";

function Page() {
  return (
    <SessionProvider>
      <TextareaForm />
    </SessionProvider>
  );
}

export default Page;
