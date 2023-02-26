import { AudioRecorder } from "@/components/AudioRecorder";
import { trpc } from "../utils/trpc";

export default function IndexPage() {
  const hello = trpc.hello.useQuery({ text: "sarah" });
  if (!hello.data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <p>{hello.data.greeting}</p>
      <AudioRecorder />
    </div>
  );
}
