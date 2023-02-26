import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { AudioRecorder } from "../components/AudioRecorder";

describe("AudioRecorder", () => {
  it("should render two buttons", () => {
    render(<AudioRecorder />);
    const startBtn = screen.getByRole("button", { name: /start/i });
    const stopBtn = screen.getByRole("button", { name: /stop/i });
    expect(startBtn).toBeInTheDocument();
    expect(stopBtn).toBeInTheDocument();
  });
});
