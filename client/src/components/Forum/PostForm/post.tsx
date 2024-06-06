"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  post: z.string(),
  // .min(10, {
  //   message: "Bio must be at least 10 characters.",
  // })
  // .max(160, {
  //   message: "Bio must not be longer than 30 characters.",
  // }),
});

export default function TextareaForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { data: session, status } = useSession();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);

    if (session && session.user) {
      console.log("User is signed in.");
      console.log(session.user);

      const res = await fetch("/api/forum/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          userEmail: session.user.email,
          message: data.post,
        }),
      });

      const res_json = await res.json();
      console.log(res_json);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="post"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="悲しい出来事を共有してください。"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                あなたの気持ちを共有してください。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">ポスト</Button>
      </form>
    </Form>
  );
}
