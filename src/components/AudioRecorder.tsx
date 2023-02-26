import { useState } from "react";

type State = "initial" | "isRecording" | "isNotRecording";

async function convertBlobToBase64(audioBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(audioBlob);
  });
}

export function AudioRecorder() {
  const [recordingState, setRecordingState] = useState<State>("initial");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(mediaRecorder);
    const chunks: Blob[] = [];

    mediaRecorder.addEventListener("dataavailable", (e) => {
      chunks.push(e.data);
    });

    mediaRecorder.addEventListener("stop", async () => {
      setRecordingState("isNotRecording");
      const audioBlob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      try {
        const audioBase64 = await convertBlobToBase64(audioBlob);
        // TODO@jsjoeio - send to backend
        console.log(audioBase64);
      } catch (error) {
        console.error(error);
      }
    });

    mediaRecorder.start();
    setRecordingState("isRecording");
  };

  const handleStopClick = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
    setTimeout(() => setRecordingState("initial"), 2000);
  };

  return (
    <div>
      <button
        disabled={recordingState == "isRecording"}
        onClick={handleStartRecording}
      >
        Start
      </button>
      <button
        disabled={recordingState == "isNotRecording"}
        onClick={handleStopClick}
      >
        Stop
      </button>
    </div>
  );
}
