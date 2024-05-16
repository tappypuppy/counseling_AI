export const sendPromptToGpt = async (
  userName: string,
  roomName: string,
  message: string,
  isAudio: boolean,
  audioFile: string
) => {
  console.log("service.ts file");

  const res = await fetch("http://localhost:8000/input/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      user_name: userName,
      room_name: roomName,
      message: message,
      is_audio: isAudio,
      audio_file: audioFile,
    }),
  });

  // const gptResponseMessage = res.json();
  return res;
};
