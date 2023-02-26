import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Hello } from "../components/Hello";

describe("Hello", () => {
  it("should render", () => {
    render(<Hello />);
    expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
  });
});
