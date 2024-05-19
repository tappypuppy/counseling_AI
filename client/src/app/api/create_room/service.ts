export const create_room = async (
    userEmail: string,
  ) => {
    console.log("service.ts file: create_room");
  
    const res = await fetch("http://localhost:8000/create_room/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        user_email: userEmail,
      }),
    });
    return res;
  };
  