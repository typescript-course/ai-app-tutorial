import { useState } from "react";

type State = "initial" | "isRecording" | "isNotRecording";

export function AudioRecorder() {
  const [recordingState, setRecordingState] = useState<State>("initial");
  return (
    <div>
      <button
        disabled={recordingState == "isRecording"}
        onClick={() => {
          setRecordingState("isRecording");
        }}
      >
        Start
      </button>
      <button
        disabled={recordingState == "isNotRecording"}
        onClick={() => {
          setRecordingState("isNotRecording");
          setTimeout(() => setRecordingState("initial"), 2000);
        }}
      >
        Stop
      </button>
    </div>
  );
}
