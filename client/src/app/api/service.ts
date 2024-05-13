export const sendPromptToGpt = async (prompt:string, userId:string) => {

    console.log("service.ts file")

    const res = await fetch("http://localhost:8000/input/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({ input_text:prompt, user_id:userId }),
        });
  
    // const gptResponseMessage = res.json();
    return res;
  };